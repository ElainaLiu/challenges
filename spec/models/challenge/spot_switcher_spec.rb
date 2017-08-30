require 'rails_helper'

describe 'Challenge::SpotSwitcher' do
  context 'Normal Challenge' do
    let!(:challenge) { create(:normal_challenge) }
    let!(:winner) { challenge.users.select(&:alternate?).first }
    let!(:loser) { challenge.users.reject(&:alternate?).first }
    let!(:spot_for_loser) { winner.spot }

    before do
      challenge.user_challenges.each do |uc|
        if uc.user.alternate?
          uc.update(place: UserChallenge.places[:first])
        else
          uc.update(place: UserChallenge.places[:second])
        end
      end
    end

    it 'switches spots such that the winner has the challenge spot' do
      switcher = Challenge::SpotSwitcher.new challenge.performance
      switcher.run!

      winner.reload
      loser.reload
      expect(winner.spot).to eq(challenge.spot)
      expect(loser.spot).to eq(spot_for_loser)
    end
  end

  context 'Open Spot Challenge' do
    context 'user of open spot is not challenging' do
      let!(:challenge) { create(:full_open_spot_challenge) }
      let!(:winner) { challenge.users.first }
      let!(:loser) { challenge.users.last }
      let!(:user_of_challenge_spot) { create(:user, spot: challenge.spot) }
      let!(:spot_for_winner) { challenge.spot }
      let!(:spot_for_loser) { loser.spot }
      let!(:spot_for_user_of_challenge_spot) { winner.spot }

      before do
        challenge.user_challenges.each_with_index do |uc, index|
          uc.update(place: index + 1)
        end
      end

      it 'switches the users appropriately' do
        switcher = Challenge::SpotSwitcher.new challenge.performance
        switcher.run!

        winner.reload
        loser.reload
        user_of_challenge_spot.reload
        expect(winner.spot).to eq(spot_for_winner)
        expect(loser.spot).to eq(spot_for_loser)
        expect(user_of_challenge_spot.spot).to eq(spot_for_user_of_challenge_spot)
      end
    end

    context 'user of open spot is challenging' do
      let!(:open_spot_challenge) { create(:full_open_spot_challenge) }
      let!(:normal_challenge_spot) { create(:spot, row: :a, file: 11) }
      let!(:open_spot_winner) { open_spot_challenge.users.first }
      let!(:open_spot_loser) { open_spot_challenge.users.last }
      let!(:user_of_open_challenge_spot) { create(:user, spot: open_spot_challenge.spot) }
      let!(:user_of_normal_challenge_spot) { create(:user, spot: normal_challenge_spot) }
      let!(:spot_for_open_spot_winner) { open_spot_challenge.spot }
      let!(:spot_for_open_spot_loser) { open_spot_loser.spot }
      let!(:normal_challenge) {
        Challenge::Bylder.perform(user_of_open_challenge_spot, open_spot_challenge.performance, normal_challenge_spot)
      }

      context 'and that user loses' do
        let!(:spot_for_normal_winner) { normal_challenge_spot }
        let!(:spot_for_normal_loser) { open_spot_winner.spot }

        before do
          open_spot_challenge.user_challenges.each_with_index do |uc, index|
            uc.update(place: index + 1)
          end
          normal_challenge.user_challenges.each do |uc|
            # Make sure user who owned open spot loses
            if uc.user == user_of_open_challenge_spot
              uc.update(place: UserChallenge.places[:second])
            else
              uc.update(place: UserChallenge.places[:first])
            end
          end
        end

        it 'switches the spots appropriately' do
          switcher = Challenge::SpotSwitcher.new open_spot_challenge.performance
          switcher.run!

          open_spot_winner.reload
          open_spot_loser.reload
          user_of_open_challenge_spot.reload
          user_of_normal_challenge_spot.reload

          expect(open_spot_winner.spot).to eq(spot_for_open_spot_winner)
          expect(open_spot_loser.spot).to eq(spot_for_open_spot_loser)
          expect(user_of_open_challenge_spot.spot).to eq(spot_for_normal_loser)
          expect(user_of_normal_challenge_spot.spot).to eq(spot_for_normal_winner)
        end
      end

      context 'and that user wins' do
        let!(:spot_for_normal_winner) { open_spot_winner.spot }
        let!(:spot_for_normal_loser) { normal_challenge_spot }

        before do
          open_spot_challenge.user_challenges.each_with_index do |uc, index|
            uc.update(place: index + 1)
          end
          normal_challenge.user_challenges.each do |uc|
            # Make sure user who owned open spot wins
            if uc.user != user_of_open_challenge_spot
              uc.update(place: UserChallenge.places[:second])
            else
              uc.update(place: UserChallenge.places[:first])
            end
          end
        end

        it 'switches the spots appropriately' do
          switcher = Challenge::SpotSwitcher.new open_spot_challenge.performance
          switcher.run!

          open_spot_winner.reload
          open_spot_loser.reload
          user_of_open_challenge_spot.reload
          user_of_normal_challenge_spot.reload

          expect(open_spot_winner.spot).to eq(spot_for_open_spot_winner)
          expect(open_spot_loser.spot).to eq(spot_for_open_spot_loser)
          expect(user_of_open_challenge_spot.spot).to eq(spot_for_normal_loser)
          expect(user_of_normal_challenge_spot.spot).to eq(spot_for_normal_winner)
        end
      end
    end
  end

  context 'Tri Challenge' do
    let(:challenge) { create(:tri_challenge) }

    context 'the challenge places are in the order the members are already alternates' do
      let(:first_place) { challenge.users.reject(&:alternate?).first }
      let(:second_place) { challenge.users.sort { |a, b| a.spot.file - b.spot.file }.select(&:alternate?).first }
      let(:third_place) { challenge.users.select { |u| u != first_place && u != second_place }.first }
      let(:first_place_spot) { first_place.spot }
      let(:second_place_spot) { second_place.spot }
      let(:third_place_spot) { third_place.spot }

      before do
        challenge.user_challenges.each_with_index do |uc, index|
          uc.update(place: index + 1)
        end
      end
      it 'doesn\'t switch the spots at all' do
        switcher = Challenge::SpotSwitcher.new challenge.performance
        switcher.run!

        first_place.reload
        second_place.reload
        third_place.reload

        expect(first_place.spot).to eq(first_place_spot)
        expect(second_place.spot).to eq(second_place_spot)
        expect(third_place.spot).to eq(third_place_spot)
      end
    end

    context 'the regular wins, but the alternate with the higher spot wins' do
      let!(:first_place) { challenge.users.reject(&:alternate?).first }
      let!(:second_place) { challenge.users.sort { |a, b| a.spot.file - b.spot.file }.select(&:alternate?).last }
      let!(:third_place) { challenge.users.select { |u| u != first_place && u != second_place }.first }
      let!(:first_place_spot) { first_place.spot }
      # second and third place should switch spots
      let!(:second_place_spot) { third_place.spot }
      let!(:third_place_spot) { second_place.spot }

      before do
        challenge.user_challenges.each do |uc|
          if uc.user == first_place
            uc.update(place: 1)
          elsif uc.user == second_place
            uc.update(place: 2)
          else
            uc.update(place: 3)
          end
        end
      end

      it 'switches the two alternate spots' do
        switcher = Challenge::SpotSwitcher.new challenge.performance
        switcher.run!

        first_place.reload
        second_place.reload
        third_place.reload

        expect(first_place.spot).to eq(first_place_spot)
        expect(second_place.spot).to eq(second_place_spot)
        expect(third_place.spot).to eq(third_place_spot)
      end
    end

    context 'the lowest alternate wins and the regular comes in 3rd place' do
      let!(:first_place) { challenge.users.sort { |a, b| a.spot.file - b.spot.file }.select(&:alternate?).last }
      let!(:second_place) { challenge.users.sort { |a, b| a.spot.file - b.spot.file }.select(&:alternate?).first }
      let!(:third_place) { challenge.users.reject(&:alternate?).first }
      # first and third place should switch spots
      let!(:first_place_spot) { third_place.spot }
      let!(:second_place_spot) { second_place.spot }
      let!(:third_place_spot) { first_place.spot }

      before do
        challenge.user_challenges.each do |uc|
          if uc.user == first_place
            uc.update(place: 1)
          elsif uc.user == second_place
            uc.update(place: 2)
          else
            uc.update(place: 3)
          end
        end
      end

      it 'switches the regular and last alternate' do
        switcher = Challenge::SpotSwitcher.new challenge.performance
        switcher.run!

        first_place.reload
        second_place.reload
        third_place.reload

        expect(first_place.spot).to eq(first_place_spot)
        expect(second_place.spot).to eq(second_place_spot)
        expect(third_place.spot).to eq(third_place_spot)
      end
    end

    context 'the lowest alternate wins and the regular comes in second' do
      let!(:first_place) { challenge.users.sort { |a, b| a.spot.file - b.spot.file }.select(&:alternate?).last }
      let!(:second_place) { challenge.users.reject(&:alternate?).first }
      let!(:third_place) { challenge.users.sort { |a, b| a.spot.file - b.spot.file }.select(&:alternate?).first }
      # first and third place should switch spots
      let!(:first_place_spot) { second_place.spot }
      let!(:second_place_spot) { third_place.spot }
      let!(:third_place_spot) { first_place.spot }

      before do
        challenge.user_challenges.each do |uc|
          if uc.user == first_place
            uc.update(place: 1)
          elsif uc.user == second_place
            uc.update(place: 2)
          else
            uc.update(place: 3)
          end
        end
      end

      it 'switches everyone' do
        switcher = Challenge::SpotSwitcher.new challenge.performance
        switcher.run!

        first_place.reload
        second_place.reload
        third_place.reload

        expect(first_place.spot).to eq(first_place_spot)
        expect(second_place.spot).to eq(second_place_spot)
        expect(third_place.spot).to eq(third_place_spot)
      end
    end
  end
end
