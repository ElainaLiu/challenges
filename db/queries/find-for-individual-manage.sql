SELECT
  userspot.name AS name,
  userspot.nameNumber AS nameNumber,
  userspot.spotid AS spotId,
  userspot.spotOpen,
  manageperformance.reason,
  manageperformance.voluntary,
  manageperformance.performanceid,
  manageperformance.performancename
FROM (
  SELECT name, nameNumber, open AS spotOpen, id AS spotid
  FROM users
  JOIN spots ON users.spotId = spots.id
  WHERE users.nameNumber = $1
) userspot
LEFT JOIN (
  SELECT m.id AS manageid, m.usernamenumber, m.reason, m.voluntary, p.id AS performanceid, p.name AS performancename
  FROM performances AS p
  JOIN manage AS m ON p.id = m.performanceid
) manageperformance
ON userspot.namenumber = manageperformance.usernamenumber
ORDER BY manageperformance.manageid DESC;
