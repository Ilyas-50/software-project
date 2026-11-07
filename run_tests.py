"""
Test runner for Smart Campus Room Catalog.
Run with: python3 run_tests.py
"""
import sys
import os
import unittest

# Add src/ to the import path so tests can find rooms, filtering, booking_v2
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "src"))

# Make tests importable as a package
os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)), "tests"), exist_ok=True)
init_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tests", "__init__.py")
if not os.path.exists(init_path):
    with open(init_path, "w") as f:
        f.write("")

loader = unittest.TestLoader()
suite = loader.discover(
    start_dir=os.path.join(os.path.dirname(os.path.abspath(__file__)), "tests"),
    pattern="test_*.py",
)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
sys.exit(0 if result.wasSuccessful() else 1)