FactoryGirl.define do
  factory :challenge do
    performance { FactoryGirl.create(:performance) }
    after(:build) do |c|
      c.user_challenges.each do |uc|
        uc.spot = uc.user.current_spot
      end
    end
  end

  factory :open_spot_challenge, parent: :challenge do
    challenge_type :open_spot
    spot { Spot.create(row: :a, file: 1) }
    users { [FactoryGirl.create(:user, :spot_a13, :trumpet, :solo)] }
  end

  factory :full_open_spot_challenge, parent: :challenge do
    challenge_type :open_spot
    spot { Spot.create(row: :a, file: 1) }
    users {
      [
        FactoryGirl.create(:user, :spot_a13, :trumpet, :solo),
        FactoryGirl.create(:user, :spot_a14, :trumpet, :solo)
      ]
    }
  end

  factory :normal_challenge, parent: :challenge do
    challenge_type :normal
    spot { Spot.create(row: :a, file: 1) }
    users {
      [
        FactoryGirl.create(:user, :spot_a13, :trumpet, :solo),
        FactoryGirl.create(:user, :trumpet, :solo, current_spot: spot, original_spot: spot)
      ]
    }
  end

  factory :tri_challenge, parent: :challenge do
    challenge_type :tri
    spot { FactoryGirl.create(:spot, row: :j, file: 8) }
    users {
      [
        FactoryGirl.create(:user, :spot_j15, :percussion, :bass),
        FactoryGirl.create(:user, :spot_j17, :percussion, :bass),
        FactoryGirl.create(:user, :percussion, :bass, current_spot: spot)
      ]
    }
  end
end
