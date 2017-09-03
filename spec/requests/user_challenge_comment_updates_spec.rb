require 'rails_helper'

describe 'User Challenges Evaluation', type: :request do
  subject(:request) { put endpoint, params: params.to_json, headers: authenticated_header(user) }
  let(:user) { create(:admin_user) }
  let(:challenge) { create(:normal_challenge) }
  let(:params) { { user_challenges: user_challenge_params } }

  describe 'PUT /api/user_challenges/comments' do
    let(:endpoint) { '/api/user_challenges/comments' }
    let(:garbage_comment) { 'garbage comment' }
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
      challenge.user_challenges.each_with_index do |user_challenge, index|
        user_challenge.update(place: index + 1)
        user_challenge.update(comments: garbage_comment)
      end
      challenge.update(stage: :done)
    end

    context 'when the user can update' do
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

    context 'when the user cannot update' do
      let(:user) { create(:user, :member) }

      it 'has the correct status' do
        request
        expect(response).to have_http_status(:unauthorized)
      end

      it 'does not update the user challenges' do
        request

        expect(challenge.reload.user_challenges.first.comments).to eq(garbage_comment)
        expect(challenge.reload.user_challenges.last.comments).to eq(garbage_comment)
      end
    end

    context 'when the comments cannot be saved' do
      let(:bad_result) { instance_double(Result, errors: []) }
      let(:evaluator) { instance_double(UserChallenge::Evaluator) }

      before do
        allow(UserChallenge::Evaluator).to receive(:new).and_return(evaluator)
        allow(evaluator).to receive(:save_comments).and_return(bad_result)
        allow(bad_result).to receive(:success?).and_return(false)
      end

      it 'has the correct status' do
        request
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'does not update the user challenges' do
        request

        expect(challenge.reload.user_challenges.first.comments).to eq(garbage_comment)
        expect(challenge.reload.user_challenges.last.comments).to eq(garbage_comment)
      end
    end
  end
end
