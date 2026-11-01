#!/usr/bin/env python3
"""Opt-in Claude hook collector; omit prompt bodies, commands and tool results."""
import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import sys
import uuid


def token(value, fallback='unknown'):
    value = str(value or fallback)
    return re.sub(r'[^a-zA-Z0-9_.:/-]', '_', value)[:160]


def normalize(data, project_root):
    hook = data.get('hook_event_name')
    supported = {'SessionStart','UserPromptSubmit','InstructionsLoaded','PreToolUse',
                 'PostToolUse','PostToolUseFailure','Stop','SubagentStart','SubagentStop'}
    if hook not in supported:
        return []
    session = token(data.get('session_id'))
    now = datetime.now(timezone.utc).isoformat()
    base = dict(version=1, sessionId=session, source='claude', timestamp=now,
                evidence='recorded', status='info')
    def event(kind, label, **kw):
        return dict(base, id=str(uuid.uuid4()), kind=kind, label=label, **kw)
    def local_path(value):
        if not isinstance(value, str) or not data.get('cwd'):
            return None
        root = Path(project_root).resolve()
        cwd = Path(data['cwd']).resolve()
        p = Path(value)
        p = (cwd/p).resolve() if not p.is_absolute() else p.resolve()
        try:
            return p.relative_to(root).as_posix()
        except ValueError:
            return None
    if hook in {'PreToolUse','PostToolUse','PostToolUseFailure'}:
        tool = token(data.get('tool_name'))
        call = token(data.get('tool_use_id'), str(uuid.uuid4()))
        item = event('tool', tool)
        item.update(id='tool:'+call, status={'PreToolUse':'started',
                    'PostToolUse':'completed','PostToolUseFailure':'failed'}[hook])
        events = [item]
        args = data.get('tool_input') or {}
        if hook == 'PostToolUse' and isinstance(args,dict):
            p = local_path(args.get('file_path'))
            if p and tool in {'Read','Write','Edit','MultiEdit'}:
                child = event('context' if tool == 'Read' else 'artifact', p,
                              parentId=item['id'], path=p)
                child['status']='completed'; events.append(child)
            if tool == 'Skill':
                events.append(event('skill', token(args.get('skill')), parentId=item['id']))
        return events
    if hook == 'InstructionsLoaded':
        p = local_path(data.get('file_path'))
        return [event('context', p or 'Instructions outside project', **({'path':p} if p else {}))]
    labels = {'SessionStart':'Session started','UserPromptSubmit':'Prompt submitted (body omitted)',
              'Stop':'Agent turn stopped','SubagentStart':'Subagent started',
              'SubagentStop':'Subagent stopped'}
    return [event('task' if hook == 'UserPromptSubmit' else 'session', labels[hook])]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--project-root', required=True, type=Path,
                        help='Stable workspace root, independent of the current tool cwd')
    args = parser.parse_args()
    try:
        raw = sys.stdin.buffer.read(1024*1024+1)
        if len(raw)>1024*1024:
            raise ValueError('Hook payload exceeds 1 MiB')
        data=json.loads(raw)
        if not isinstance(data,dict):
            raise ValueError('Expected event object')
        events=normalize(data, args.project_root)
        out=args.output.absolute()
        for parent in [out,*out.parents]:
            if parent.is_symlink():
                raise ValueError('Symlink output refused')
        out.parent.mkdir(parents=True,exist_ok=True)
        payload=''.join(json.dumps(e,ensure_ascii=True)+'\n' for e in events).encode()
        fd=os.open(out,os.O_WRONLY|os.O_CREAT|os.O_APPEND|getattr(os,'O_NOFOLLOW',0),0o600)
        try:
            if payload: os.write(fd,payload)
        finally:
            os.close(fd)
    except (ValueError, OSError, TypeError) as error:
        # Observability must not grant permissions or change the agent's outcome.
        print('ROC trace collection failed: '+str(error),file=sys.stderr)
    print('{}')
    return 0


if __name__=='__main__': sys.exit(main())
