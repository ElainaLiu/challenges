class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email, null: false, unique: true
      t.string :password_digest, null: false
      t.string :buck_id, null: false, unique: true
      t.column :instrument, :integer, null: false
      t.column :part, :integer, null: false
      t.column :role, :integer, null: false
      t.datetime :password_updated, null: false, default: -> { 'CURRENT_TIMESTAMP' }
      t.index :buck_id
      t.index :email
      t.belongs_to :spot
      t.timestamps
    end
  end
end
