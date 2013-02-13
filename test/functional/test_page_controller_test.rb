require 'test_helper'

class TestPageControllerTest < ActionController::TestCase
  test "should get home" do
    get :home
    assert_response :success
  end

end
