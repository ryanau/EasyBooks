class SmsInputVerifier
  attr_reader :message, :from
  def initialize(params)
    @from = params[:From][2, params[:From].length]
    @body = params[:Body]
    @command = {}
    @message = {}
    @star = {}
    @post = {}
  end

  def ok?
    if verify_command
      check_input
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
      @message = "You can now talk to #{@post.seller.first_name}, the seller of #{@post.title} directly."
    end
  end
end