---
description: Implements code
mode: subagent
model: opencode/deepseek-v4.1-flash
permissions:
  - action: subagent
    resource: "*"
    effect: allow

  - action: intellij_*
    resource: "*"
    effect: deny

  - action: intellij_apply_patch
    resource: "*"
    effect: allow
  - action: intellij_create_new_file
    resource: "*"
    effect: allow
  - action: intellij_reformat_file
    resource: "*"
    effect: allow
  - action: intellij_post_edit_quality_check
    resource: "*"
    effect: allow
  - action: intellij_lint_files
    resource: "*"
    effect: allow

  - action: intellij_rename_refactoring
    resource: "*"
    effect: allow
  - action: intellij_extract_method
    resource: "*"
    effect: allow
  - action: intellij_extract_interface
    resource: "*"
    effect: allow
  - action: intellij_extract_base_class
    resource: "*"
    effect: allow
  - action: intellij_change_api_signature
    resource: "*"
    effect: allow
  - action: intellij_move_type_to_namespace
    resource: "*"
    effect: allow
  - action: intellij_reorganize_namespaces
    resource: "*"
    effect: allow
  - action: intellij_safe_delete
    resource: "*"
    effect: allow

  - action: intellij_read_file
    resource: "*"
    effect: allow
  - action: intellij_search_text
    resource: "*"
    effect: allow
  - action: intellij_search_regex
    resource: "*"
    effect: allow
  - action: intellij_search_file
    resource: "*"
    effect: allow
  - action: intellij_search_symbol
    resource: "*"
    effect: allow
  - action: intellij_search_tags
    resource: "*"
    effect: allow
  - action: intellij_get_symbol_info
    resource: "*"
    effect: allow
  - action: intellij_find_usages
    resource: "*"
    effect: allow
  - action: intellij_find_implementations
    resource: "*"
    effect: allow
  - action: intellij_get_class_hierarchy
    resource: "*"
    effect: allow
  - action: intellij_find_default_value_overrides
    resource: "*"
    effect: allow
  - action: intellij_list_directory_tree
    resource: "*"
    effect: allow
  - action: intellij_get_all_open_file_paths
    resource: "*"
    effect: allow
  - action: intellij_open_file_in_editor
    resource: "*"
    effect: allow

  - action: intellij_build_solution_start
    resource: "*"
    effect: allow
  - action: intellij_build_solution_state
    resource: "*"
    effect: allow
  - action: intellij_get_file_problems
    resource: "*"
    effect: allow
  - action: intellij_get_project_problems
    resource: "*"
    effect: allow
  - action: intellij_get_solution_projects
    resource: "*"
    effect: allow
  - action: intellij_get_project_dependencies
    resource: "*"
    effect: allow
  - action: intellij_findTests
    resource: "*"
    effect: allow
  - action: intellij_test_run_start
    resource: "*"
    effect: allow
  - action: intellij_test_run_state
    resource: "*"
    effect: allow
  - action: intellij_get_run_configurations
    resource: "*"
    effect: allow
  - action: intellij_execute_run_configuration
    resource: "*"
    effect: allow

  - action: intellij_git_status
    resource: "*"
    effect: allow
  - action: intellij_get_repositories
    resource: "*"
    effect: allow
  - action: intellij_get_changelists
    resource: "*"
    effect: allow
  - action: intellij_create_changelist
    resource: "*"
    effect: allow
  - action: intellij_move_changes_to_changelist
    resource: "*"
    effect: allow
  - action: intellij_set_active_changelist
    resource: "*"
    effect: allow

  - action: intellij_air_set_session_title
    resource: "*"
    effect: allow
---

# Development style
# Process notes

- when using `post_edit_quality_check` tool from `intellij` mcp, ensure `min_severity = warning` and not `error`, as it is by default
- after development is finished, run `get_file_problems` tool from `intellij` mcp to ensure there are no warnings. Address those if found. If intellij offers a fix to a given issue, use that instead of figuring one out yourself.
- build the solution, it should build successfully. Exception to this rule is when the instruction excplitly indicates that it's a part of some bigger work and as such is allowed to fail build.