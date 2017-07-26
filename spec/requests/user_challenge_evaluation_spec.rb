require 'rails_helper'

describe 'User Challenges Evaluation', type: :request do
  subject(:request) { post endpoint, params: params.to_json, headers: authenticated_header(admin) }
  let(:admin) { create(:admin_user) }
  let(:challenge) { create(:normal_challenge) }
  let(:params) { { user_challenges: user_challenge_params } }

  describe 'POST /api/user_challenges/comments' do
    let(:endpoint) { '/api/user_challenges/comments' }
    let(:comments_1) { 'User 1 did some things.' }
    let(:comments_2) { 'User 2 did some other things.' }
    let(:user_challenge_params) do
      [
        {
          id: challenge.user_challenges.first.id,
          comments: comments_1
        },
        {
          id: challenge.user_challenges.last.id,
          comments: comments_2
        }
      ]
    end

    before do
      allow(UserChallenge).to receive(:find).and_return(challenge.user_challenges.first)
      allow(challenge.user_challenges.first).to receive(:challenge).and_return(challenge)
    end

    context 'when the user can evaluate' do
      before do
        allow(challenge).to receive(:can_be_evaluated_by?).and_return(true)
      end

      it 'has the correct status' do
        request
        expect(response).to have_http_status(:no_content)
      end

      it 'updates the user challenges' do
        request

        expect(challenge.reload.user_challenges.first.comments).to eq(comments_1)
        expect(challenge.reload.user_challenges.last.comments).to eq(comments_2)
      end
    end

    context 'when the user cannot evaluate' do
      before do
        allow(challenge).to receive(:can_be_evaluated_by?).and_return(false)
      end

      it 'has the correct status' do
        request
        expect(response).to have_http_status(:unauthorized)
      end

      it 'does not update the user challenges' do
        request

        expect(challenge.reload.user_challenges.first.comments).to be_nil
        expect(challenge.reload.user_challenges.last.comments).to be_nil
      end
    end
  end

  describe 'POST /api/user_challenges/places' do
    let(:endpoint) { '/api/user_challenges/places' }
    let(:place_1) { 1 }
    let(:place_2) { 2 }
    let(:user_challenge_params) do
      [
        {
          id: challenge.user_challenges.first.id,
          place: place_1
        },
        {
          id: challenge.user_challenges.last.id,
          place: place_2
        }
      ]
    end

    before do
      allow(UserChallenge).to receive(:find).and_return(challenge.user_challenges.first)
      allow(challenge.user_challenges.first).to receive(:challenge).and_return(challenge)
    end

    context 'when the user can evaluate' do
      before do
        allow(challenge).to receive(:can_be_evaluated_by?).and_return(true)
      end

      it 'has the correct status' do
        request
        expect(response).to have_http_status(:no_content)
      end

      it 'updates the user challenges' do
        request

        expect(UserChallenge.places[challenge.reload.user_challenges.first.place]).to eq(place_1)
        expect(UserChallenge.places[challenge.reload.user_challenges.last.place]).to eq(place_2)
      end
    end

    context 'when the user cannot evaluate' do
      before do
        allow(challenge).to receive(:can_be_evaluated_by?).and_return(false)
      end

      it 'has the correct status' do
        request
        expect(response).to have_http_status(:unauthorized)
      end

      it 'updates the user challenges' do
        request

        expect(challenge.reload.user_challenges.first.place).to be_nil
        expect(challenge.reload.user_challenges.last.place).to be_nil
      end
    end
  end
end
