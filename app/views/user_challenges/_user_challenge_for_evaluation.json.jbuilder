json.id user_challenge.id
json.comments user_challenge.comments
json.place user_challenge.place
json.userBuckId user_challenge.user.id
json.challengeId user_challenge.challenge.id
json.user do
  json.partial! 'users/user', user: user_challenge.user
end
