json.id challenge.id
json.challengeType challenge.challenge_type
json.spot do
  json.partial! 'spots/spot', spot: challenge.spot
end
json.users do
  json.array! challenge.users.each do |user|
    json.partial! 'users/user', user: user
  end
end
json.performance do
  json.partial! 'performances/performance', performance: challenge.performance
end
