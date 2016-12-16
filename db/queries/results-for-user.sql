SELECT * FROM
  (
    SELECT
      R1.id,
      get_user_result_comments(R1.first_name_number, R1.first_comments, R1.second_comments, $1) AS comments,
      P.id AS performance_id,
      P.name,
      R1.winner_id,
      R1.spot_id,
      P.performdate
    FROM Results AS R1, Performances AS P
    WHERE (R1.first_name_number = $1 OR R1.second_name_number = $1) AND R1.performance_id = P.id AND NOT R1.pending AND NOT R1.needs_approval
  ) t1
LEFT JOIN
  (SELECT U.name AS opponent_name, R2.id
  FROM Users AS U, Results AS R2
  WHERE U.name_number = get_other_user_id($1, R2.first_name_number, R2.second_name_number)) t2
ON
  t1.id = t2.id;
