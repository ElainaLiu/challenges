require 'rails_helper'

describe 'Challenge Approval', type: :request do
  let(:user) { create(:admin_user) }
  let(:challenge) { create(:normal_challenge) }
  let(:non_admin_user) { create(:user) }

  describe 'PUT /api/challenges/approve' do
    let(:endpoint) { "/api/challenges/#{challenge.id}/approve" }

    before do
      challenge.user_challenges.each_with_index do |uc, index|
        uc.update(place: index + 1)
      end
    end

    it 'prevents a non admin user from approving a challenge' do
      put endpoint, headers: authenticated_header(non_admin_user)

      expect(response).to have_http_status(:forbidden)
    end

    it 'changes the challenge\'s stage to :done' do
      put endpoint, headers: authenticated_header(user)

      expect(response).to have_http_status(:no_content)
      expect(challenge.reload.stage).to eq(:done.to_s)
    end

    context 'switching spots' do
      before do
        challenge.user_challenges.each do |uc|
          user = uc.user
          if user.alternate?
            uc.update(place: UserChallenge.places[:first])
          else
            uc.update(place: UserChallenge.places[:second])
          end
        end
      end

      it 'gives the winner the regular spot and the loser the alternate spot' do
        put endpoint, headers: authenticated_header(user)

        winner = challenge.reload.user_challenges.select(&:first_place?).first.user.reload
        loser = challenge.reload.user_challenges.reject(&:first_place?).first.user.reload

        expect(winner.alternate?).to eq(false)
        expect(loser.alternate?).to eq(true)
      end
    end
  end
end
