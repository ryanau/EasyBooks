# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151111175032) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "commands", force: :cascade do |t|
    t.integer  "star_id"
    t.string   "random_num",      null: false
    t.string   "action",          null: false
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "subscription_id"
  end

  create_table "comments", force: :cascade do |t|
    t.string   "content",    null: false
    t.integer  "user_id",    null: false
    t.integer  "post_id",    null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "conversations", force: :cascade do |t|
    t.integer  "star_id",                        null: false
    t.integer  "seller_id",                      null: false
    t.integer  "buyer_id",                       null: false
    t.integer  "seller_phone_id",                null: false
    t.integer  "buyer_phone_id",                 null: false
    t.boolean  "active",          default: true
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
  end

  create_table "courses", force: :cascade do |t|
    t.string   "department",                   null: false
    t.string   "course_number",                null: false
    t.string   "semester",                     null: false
    t.string   "year",                         null: false
    t.integer  "university_id",                null: false
    t.boolean  "active",        default: true
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

  create_table "credits", force: :cascade do |t|
    t.integer  "user_id",                     null: false
    t.string   "method"
    t.integer  "promouse_id"
    t.boolean  "used",        default: false
    t.boolean  "active",      default: true
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  create_table "entries", force: :cascade do |t|
    t.integer  "seller_id",            null: false
    t.integer  "buyer_id",             null: false
    t.integer  "post_id",              null: false
    t.string   "venmo_transaction_id"
    t.string   "amount",               null: false
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  create_table "paymentcodes", force: :cascade do |t|
    t.integer  "conversation_id", null: false
    t.string   "random_num",      null: false
    t.integer  "seller_id",       null: false
    t.integer  "buyer_id",        null: false
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "phones", force: :cascade do |t|
    t.string   "number",     null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "posts", force: :cascade do |t|
    t.float    "price",                         null: false
    t.string   "picture_url"
    t.string   "title",                         null: false
    t.string   "description"
    t.boolean  "sold",          default: false
    t.boolean  "public",        default: true
    t.string   "pickup"
    t.string   "condition",                     null: false
    t.integer  "university_id",                 null: false
    t.integer  "course_id",                     null: false
    t.integer  "seller_id",                     null: false
    t.integer  "buyer_id"
    t.boolean  "active",        default: true
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.string   "author"
  end

  create_table "promos", force: :cascade do |t|
    t.string   "code",                      null: false
    t.date     "expiry"
    t.integer  "credit"
    t.string   "info"
    t.boolean  "active",     default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "promouses", force: :cascade do |t|
    t.integer  "user_id",                   null: false
    t.integer  "promo_id",                  null: false
    t.boolean  "active",     default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "stars", force: :cascade do |t|
    t.integer  "post_id",                    null: false
    t.integer  "user_id",                    null: false
    t.boolean  "sent",       default: false
    t.boolean  "accepted",   default: false
    t.boolean  "active",     default: true
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.boolean  "expired",    default: false
  end

  create_table "subscriptions", force: :cascade do |t|
    t.integer  "user_id",                   null: false
    t.integer  "course_id",                 null: false
    t.boolean  "active",     default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "universities", force: :cascade do |t|
    t.string   "name",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "uid",                             null: false
    t.string   "first_name",                      null: false
    t.string   "last_name",                       null: false
    t.string   "email"
    t.string   "phone"
    t.string   "token",                           null: false
    t.string   "pic",                             null: false
    t.string   "password_digest"
    t.boolean  "completed",       default: false
    t.integer  "university_id"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  create_table "venmo_accounts", force: :cascade do |t|
    t.string   "venmo_uid"
    t.string   "token"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
