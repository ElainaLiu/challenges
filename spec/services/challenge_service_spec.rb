require 'rails_helper'

describe ChallengeService do
  describe '.check_other_challenges_are_done' do
    context 'one challenge' do
      let!(:challenge) { create(:normal_challenge, stage: stage) }

      context 'in the done stage' do
        let(:stage) { :done }

        it 'calls the spot switch job' do
          expect(SwitchSpotForChallengeJob).to receive(:perform_later)
            .with(challenge_id: challenge.id)
            .and_return(true)

          described_class.check_other_challenges_are_done(challenge_id: challenge.id)
        end
      end

      context 'not in the done stage' do
        let(:stage) { :needs_comments }

        it 'doesn\'t call the spot switch job' do
          expect(SwitchSpotForChallengeJob).not_to receive(:perform_later)

          described_class.check_other_challenges_are_done(challenge_id: challenge.id)
        end
      end
    end

    context 'multiple challenges' do
      context 'with users with different spots' do
        let!(:challenge_to_switch) { create(:normal_challenge, stage: :done) }
        let!(:challenge_not_to_switch) { create(:tri_challenge, stage: :done) }

        it 'doesn\'t switch the wrong challenge' do
          expect(SwitchSpotForChallengeJob).not_to receive(:perform_later)
            .with(challenge_id: challenge_not_to_switch.id)
          expect(SwitchSpotForChallengeJob).to receive(:perform_later)
            .with(challenge_id: challenge_to_switch.id)

          described_class.check_other_challenges_are_done(challenge_id: challenge_to_switch.id)
        end
      end

      context 'with users with the same instruments and parts and done stage' do
        let(:challenges) do
          performance = create(:performance)
          first_challenge_users = [
            create(:user, :spot_a1, :trumpet, :solo),
            create(:user, :spot_a13, :trumpet, :solo)
          ]
          first_challenge_spot = first_challenge_users.first.current_spot
          second_challenge_users = [
            create(:user, :spot_x1, :trumpet, :solo),
            create(:user, :spot_x13, :trumpet, :solo)
          ]
          second_challenge_spot = second_challenge_users.first.current_spot
          [
            create(:normal_challenge, users: first_challenge_users, spot: first_challenge_spot, performance: performance, stage: :done),
            create(:normal_challenge, users: second_challenge_users, spot: second_challenge_spot, performance: performance, stage: :done)
          ]
        end

        it 'calls the spot switch for all challenges' do
          expect(SwitchSpotForChallengeJob).to receive(:perform_later)
            .with(challenge_id: challenges.first.id)
          expect(SwitchSpotForChallengeJob).to receive(:perform_later)
            .with(challenge_id: challenges.last.id)

          described_class.check_other_challenges_are_done(challenge_id: challenges.first.id)
        end
      end

      context 'with users with the same instruments and different parts and done stage' do
        let(:challenges) do
          performance = create(:performance)
          first_challenge_users = [
            create(:user, :spot_a1, :trumpet, :solo),
            create(:user, :spot_a13, :trumpet, :solo)
          ]
          first_challenge_spot = first_challenge_users.first.current_spot
          second_challenge_users = [
            create(:user, :spot_x1, :trumpet, :efer),
            create(:user, :spot_x13, :trumpet, :efer)
          ]
          second_challenge_spot = second_challenge_users.first.current_spot
          [
            create(:normal_challenge, users: first_challenge_users, spot: first_challenge_spot, performance: performance, stage: :done),
            create(:normal_challenge, users: second_challenge_users, spot: second_challenge_spot, performance: performance, stage: :done)
          ]
        end

        it 'calls the spot switch for all challenges' do
          expect(SwitchSpotForChallengeJob).to receive(:perform_later)
            .with(challenge_id: challenges.first.id)
          expect(SwitchSpotForChallengeJob).not_to receive(:perform_later)
            .with(challenge_id: challenges.last.id)

          described_class.check_other_challenges_are_done(challenge_id: challenges.first.id)
        end
      end

      context 'with users with the same instruments and parts, but not all in done stage' do
        let(:challenges) do
          performance = create(:performance)
          first_challenge_users = [
            create(:user, :spot_a1, :trumpet, :solo),
            create(:user, :spot_a13, :trumpet, :solo)
          ]
          first_challenge_spot = first_challenge_users.first.current_spot
          second_challenge_users = [
            create(:user, :spot_x1, :trumpet, :solo),
            create(:user, :spot_x13, :trumpet, :solo)
          ]
          second_challenge_spot = second_challenge_users.first.current_spot
          [
            create(:normal_challenge, users: first_challenge_users, spot: first_challenge_spot, performance: performance, stage: :done),
            create(:normal_challenge, users: second_challenge_users, spot: second_challenge_spot, performance: performance, stage: :needs_comments)
          ]
        end

        it 'calls the spot switch for all challenges' do
          expect(SwitchSpotForChallengeJob).not_to receive(:perform_later)
            .with(challenge_id: challenges.first.id)
          expect(SwitchSpotForChallengeJob).not_to receive(:perform_later)
            .with(challenge_id: challenges.last.id)

          described_class.check_other_challenges_are_done(challenge_id: challenges.first.id)
        end
      end
    end
  end
end
