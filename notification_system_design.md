
> **Note (Stage 3):** The above query assumes a `students` table exists as defined in Stage 2. In the context of this API where only a `notifications` table is provided, the equivalent would be:
> ```sql
> SELECT DISTINCT student_id
> FROM notifications
> WHERE type = 'Placement'
>   AND created_at >= NOW() - INTERVAL '7 days';
> ```
