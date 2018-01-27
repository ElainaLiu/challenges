class PasswordResetMailer < ApplicationMailer
  def password_reset_email(user_buck_id:, password_reset_request_id:)
    generate_mail(user_buck_id, password_reset_request_id, 'OSUMB Challenges Password Reset')
  end

  def user_creation_email(user_buck_id:, password_reset_request_id:)
    generate_mail(user_buck_id, password_reset_request_id, 'OSUMB Challenge App')
  end

  private

  def generate_mail(user_buck_id, password_reset_request_id, subject)
    @user = User.find(user_buck_id)
    email = _real_email_strategy? ? @user.email : ENV['MAINTAINER_EMAIL']
    @reset_link = url_for_env(password_reset_request_id)
    mail(to: email, subject: subject)
  end

  def url_for_env(prr_id)
    "#{ENV['APPLICATION_URL']}/password_reset_requests/#{prr_id}"
  end
end
