import importlib.util
from pathlib import Path
import unittest

PATH = Path(__file__).resolve().parents[1]/'scripts/claude_trace.py'
if PATH.exists():
    spec=importlib.util.spec_from_file_location('collector',PATH)
    collector=importlib.util.module_from_spec(spec); spec.loader.exec_module(collector)
else:
    collector=None


class CollectorTests(unittest.TestCase):
    def events(self, data):
        self.assertIsNotNone(collector, 'Claude collector not implemented')
        return collector.normalize(data, '/project')

    def base(self, **kw):
        return dict(session_id='s1',cwd='/project',hook_event_name='PostToolUse',
                    tool_name='Read',tool_use_id='t1',tool_input={'file_path':'/project/brief.md'},**kw)

    def test_read_links_file_to_observed_tool(self):
        events=self.events(self.base())
        self.assertEqual(events[0]['status'],'completed')
        self.assertEqual(events[1]['path'],'brief.md')
        self.assertEqual(events[1]['parentId'],events[0]['id'])

    def test_prompt_and_tool_arguments_not_persisted(self):
        e=self.events({'session_id':'s1','hook_event_name':'UserPromptSubmit','prompt':'secret123'})
        self.assertNotIn('secret123',str(e))
        data=self.base(); data['tool_input']['secret']='secret123'
        self.assertNotIn('secret123',str(self.events(data)))

    def test_external_file_not_linked(self):
        data=self.base(); data['tool_input']['file_path']='/private/secret'
        events=self.events(data)
        self.assertTrue(all('path' not in e for e in events))

    def test_failed_tool_creates_no_artifact(self):
        data=self.base(); data['hook_event_name']='PostToolUseFailure'; data['tool_name']='Write'
        events=self.events(data)
        self.assertEqual(events[0]['status'],'failed')
        self.assertEqual(len(events),1)

    def test_unknown_event_rejected(self):
        self.assertEqual(self.events({'hook_event_name':'FutureEvent'}),[])

    def test_changed_cwd_uses_stable_project_root(self):
        data=self.base(); data['cwd']='/project/src'
        data['tool_input']['file_path']='index.js'
        self.assertEqual(self.events(data)[1]['path'],'src/index.js')


if __name__=='__main__': unittest.main()
