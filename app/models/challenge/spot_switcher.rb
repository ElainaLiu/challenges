class Challenge
  class SpotSwitcher
    def initialize(performance)
      @performance = performance
      @challenges = @performance.challenges
    end

    def run!
      challenge_sort.each do |challenge|
        if challenge.normal_challenge_type?
          switch_for_normal_challenge challenge
        elsif challenge.tri_challenge_type?
          switch_for_tri_challenge challenge
        else
          switch_for_open_spot_challenge challenge
        end
      end
    end

    private

    # Save the challenge involving members who vacated spots last
    # rubocop:disable Metrics/LineLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    def challenge_sort
      @challenges.sort do |a, b|
        a_vacated_spot = a.users.any? { |u| u.discipline_actions.select { |da| da.performance == @performance && da.open_spot } }
        b_vacated_spot = b.users.any? { |u| u.discipline_actions.select { |da| da.performance == @performance && da.open_spot } }
        if a_vacated_spot && !b_vacated_spot
          1
        elsif !a_vacated_spot && b_vacated_spot
          -1
        end
        0
      end
    end
    # rubocop:enable Metrics/LineLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity

    # The winner and loser switch spots
    def switch_for_normal_challenge(challenge)
      user_challenges = challenge.user_challenges
      winner = user_challenges.select(&:first_place?).first.user
      loser = user_challenges.reject(&:first_place?).first.user
      return if winner.spot == challenge.spot
      User.transaction do
        s = winner.spot
        winner.update_attributes!(spot: nil)
        loser.update_attributes!(spot: s)
        winner.update_attributes!(spot: challenge.spot)
      end
    end

    # The spot of the loser of an open spot challenge is unaffected
    def switch_for_open_spot_challenge(challenge)
      user_challenges = challenge.user_challenges
      winner = user_challenges.select(&:first_place?).first.user
      user_who_had_spot = User.find_by(spot: challenge.spot)
      User.transaction do
        winner_spot = winner.spot
        user_who_had_spot.update_attributes!(spot: nil)
        winner.update_attributes!(spot: challenge.spot)
        user_who_had_spot.update_attributes!(spot: winner_spot)
      end
    end

    # The winner gets the lowest spot numerically
    # 2nd place gets the middle number
    # 3rd place gets the highest
    # rubocop:disable Metrics/MethodLength
    def switch_for_tri_challenge(challenge)
      user_challenges = challenge.user_challenges
      first_place = user_challenges.select(&:first_place?).first.user
      second_place = user_challenges.select(&:second_place?).first.user
      last_place = user_challenges.select(&:third_place?).first.user
      return if first_place.spot.file < second_place.spot.file && second_place.spot.file < last_place.spot.file
      spots = [first_place.spot, second_place.spot, last_place.spot].sort { |a, b| a.file - b.file }

      first_place.update_attributes!(spot: nil)
      second_place.update_attributes!(spot: nil)
      last_place.update_attributes!(spot: nil)

      first_place.update_attributes!(spot: spots.first)
      second_place.update_attributes!(spot: spots[1])
      last_place.update_attributes!(spot: spots.last)
    end
    # rubocop:enable Metrics/MethodLength
  end
end
