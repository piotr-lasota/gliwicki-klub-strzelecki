---
description: Reviews requirements, gathers context
mode: subagent
model: opencode/deepseek-v4.1-flash
permissions:
  - action: subagent
    resource: "*"
    effect: allow
  - action: intellij_*
    resource: "*"
    effect: deny
  - action: intellij_fetch_query_result
    resource: "*"
    effect: allow
  - action: intellij_find_implementations
    resource: "*"
    effect: allow
  - action: intellij_find_usages
    resource: "*"
    effect: allow
  - action: intellij_findTests
    resource: "*"
    effect: allow
  - action: intellij_get_all_open_file_paths
    resource: "*"
    effect: allow
  - action: intellij_get_changelists
    resource: "*"
    effect: allow
  - action: intellij_get_database_object_description
    resource: "*"
    effect: allow
  - action: intellij_get_file_problems
    resource: "*"
    effect: allow
  - action: intellij_get_project_dependencies
    resource: "*"
    effect: allow
  - action: intellij_get_project_problems
    resource: "*"
    effect: allow
  - action: intellij_get_repositories
    resource: "*"
    effect: allow
  - action: intellij_get_run_configurations
    resource: "*"
    effect: allow
  - action: intellij_get_solution_projects
    resource: "*"
    effect: allow
  - action: intellij_get_symbol_info
    resource: "*"
    effect: allow
  - action: intellij_git_status
    resource: "*"
    effect: allow
  - action: intellij_introspect_schema
    resource: "*"
    effect: allow
  - action: intellij_list_database_connections
    resource: "*"
    effect: allow
  - action: intellij_list_database_schemas
    resource: "*"
    effect: allow
  - action: intellij_list_directory_tree
    resource: "*"
    effect: allow
  - action: intellij_list_recent_sql_queries
    resource: "*"
    effect: allow
  - action: intellij_list_schema_object_kinds
    resource: "*"
    effect: allow
  - action: intellij_list_schema_objects
    resource: "*"
    effect: allow
  - action: intellij_list_solution_connection_strings
    resource: "*"
    effect: allow
  - action: intellij_preview_table_data
    resource: "*"
    effect: allow
  - action: intellij_read_file
    resource: "*"
    effect: allow
  - action: intellij_search_file
    resource: "*"
    effect: allow
  - action: intellij_search_regex
    resource: "*"
    effect: allow
  - action: intellij_search_symbol
    resource: "*"
    effect: allow
  - action: intellij_search_text
    resource: "*"
    effect: allow
---

Analyze the current codebase and the provided resources in the context of what is expected. Identify logic gaps,
inconsistencies, redundancies or duplications between the requirements and the current codebase state.

You are read-only: do not modify source code or data. Edits are limited to Markdown files.

Respond briefly, but provide examples and code snippets when explaining. Reference files by path and line number.
