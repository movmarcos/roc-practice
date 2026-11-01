import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

KIT = Path(__file__).resolve().parents[1]


class AdapterTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.target = Path(self.temp.name) / 'project'
        self.target.mkdir()

    def run_cli(self, command, targets='codex,copilot'):
        return subprocess.run([sys.executable, str(KIT/'scripts/roc.py'), command,
                               '--target', str(self.target), '--targets', targets],
                              text=True, capture_output=True)

    def test_preview_does_not_write(self):
        r = self.run_cli('preview')
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(list(self.target.iterdir()), [])
        self.assertIn('AGENTS.md', r.stdout)

    def test_apply_check_and_idempotence(self):
        self.assertEqual(self.run_cli('apply').returncode, 0)
        before = (self.target/'AGENTS.md').read_bytes()
        self.assertEqual(self.run_cli('apply').returncode, 0)
        self.assertEqual(before, (self.target/'AGENTS.md').read_bytes())
        self.assertEqual(self.run_cli('check').returncode, 0)
        self.assertTrue((self.target/'.agents/skills/review-evidence/SKILL.md').exists())
        self.assertFalse((self.target/'.github/skills').exists())

    def test_collision_is_not_overwritten_and_no_partial_install(self):
        p = self.target/'AGENTS.md'; p.write_text('My instructions')
        r = self.run_cli('apply')
        self.assertNotEqual(r.returncode, 0)
        self.assertEqual(p.read_text(), 'My instructions')
        self.assertFalse((self.target/'.roc').exists())

    def test_local_edit_detected(self):
        self.run_cli('apply')
        (self.target/'AGENTS.md').write_text('Local edit')
        self.assertNotEqual(self.run_cli('check').returncode, 0)
        self.assertNotEqual(self.run_cli('apply').returncode, 0)

    def test_user_context_is_preserved(self):
        self.run_cli('apply')
        p = self.target/'.roc/context.md'; p.write_text('Actual finance project')
        self.assertEqual(self.run_cli('apply').returncode, 0)
        self.assertEqual(p.read_text(), 'Actual finance project')
        self.assertEqual(self.run_cli('check').returncode, 0)

    def test_symlink_parent_rejected(self):
        outside = Path(self.temp.name)/'outside'; outside.mkdir()
        (self.target/'.roc').symlink_to(outside, target_is_directory=True)
        self.assertNotEqual(self.run_cli('apply').returncode, 0)
        self.assertEqual(list(outside.iterdir()), [])

    def test_invalid_target_rejected(self):
        self.assertNotEqual(self.run_cli('apply', 'invented').returncode, 0)

    def test_copilot_duplicate_discovery_rejected(self):
        self.assertNotEqual(self.run_cli('apply', 'claude,copilot,codex').returncode, 0)
        self.assertEqual(list(self.target.iterdir()), [])

    def test_claude_only_layout(self):
        self.assertEqual(self.run_cli('apply', 'claude').returncode, 0)
        self.assertTrue((self.target/'CLAUDE.md').exists())
        self.assertTrue((self.target/'.claude/skills/resume-project/SKILL.md').exists())

    def test_preexisting_claude_skills_flagged_for_copilot(self):
        p = self.target/'.claude/skills/custom'; p.mkdir(parents=True)
        (p/'SKILL.md').write_text('custom')
        self.assertNotEqual(self.run_cli('apply', 'copilot').returncode, 0)

    def test_missing_managed_output_detected(self):
        self.run_cli('apply')
        (self.target/'AGENTS.md').unlink()
        self.assertNotEqual(self.run_cli('check').returncode, 0)

    def test_unmanaged_manifest_does_not_claim_files(self):
        self.run_cli('apply')
        p = self.target/'.roc/generated.json'
        data = json.loads(p.read_text()); data['files']['../../escape'] = 'bad'
        p.write_text(json.dumps(data))
        self.assertNotEqual(self.run_cli('apply').returncode, 0)

    def test_regular_file_parent_fails_before_any_write(self):
        (self.target/'.agents').write_text('Keep me')
        result = self.run_cli('preview')
        self.assertNotEqual(result.returncode, 0)
        self.assertNotEqual(self.run_cli('apply').returncode, 0)
        self.assertFalse((self.target/'AGENTS.md').exists())

    def test_missing_context_fails_check(self):
        self.assertEqual(self.run_cli('apply').returncode, 0)
        (self.target/'.roc/context.md').unlink()
        self.assertNotEqual(self.run_cli('check').returncode, 0)

    def test_directory_seed_fails_before_any_write(self):
        (self.target/'.roc/context.md').mkdir(parents=True)
        self.assertNotEqual(self.run_cli('apply').returncode, 0)
        self.assertFalse((self.target/'AGENTS.md').exists())


if __name__ == '__main__':
    unittest.main()
