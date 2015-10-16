class SmsInputVerifier
  def initialize(params)
    @from = params[:From][2, params[:From].length]
    @body = params[:Body]
    @command = {}
    @message = {}
    @star = {}
    @post = {}
  end

  def proceed
    if verify_command
      check_input
      send_sms(@from, @message)
    else
      @message = "Didn't recognize that command. Did you mistype?"
    end
  end

  def verify_command
    @command = Command.find_by(random_num: @body)
  end

  def check_input
    @star = Star.find(@command.star_id)
    @post = Post.find(@star.post_id)
    if @command.action == 'approve_post_alert'
      @star.update_attributes(sent: true, accepted: true)
      @command.destroy
      @message = "A message will arrive soon from #{@post.seller.first_name}, the seller of #{@post.title}. You can text the seller directly through private number.\n\nTo terminate the conversation, reply with 'EXIT' to this number.\n\nTo mark the transaction as completed, reply with 'DONE' to this number."
    end
  end

  def send_sms(from, message)
    SmsNotification.send_from_main_phone(from, message)
  end
end