FactoryGirl.define do
  factory :user do
    first_name 'Brutus'
    last_name 'Buckeye'
    email 'buckeye.1@osu.edu'
    password_digest '2349p8uasdflknadiuh'
    buck_id 'buckeye.1'
    instrument User.instruments[:trumpet]
    part User.parts[:solo]
    role User.roles[:member]
    password_updated Time.zone.now
    association :spot, row: Spot.rows[:a], file: 2
  end

  factory :admin, parent: :user do
    role User.roles[:admin]
    spot nil
  end

  factory :alternate, parent: :user do
    association :spot, row: Spot.rows[:a], file: 13
  end
end
