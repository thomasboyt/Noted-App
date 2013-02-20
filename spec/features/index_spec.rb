require 'spec_helper'

describe "visiting the index", :type => :feature, :js => true do
  it "displays the notes list" do
    visit '/'
    page.should have_content 'Welcome to Noted'
  end
end