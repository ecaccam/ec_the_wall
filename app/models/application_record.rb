class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  # DOCU: Query single SELECT records to the database
  # Triggered by: Queries from different models
  def self.query_record(sql_statement)
    return ActiveRecord::Base.connection.select_one(
      ActiveRecord::Base.send(:sanitize_sql_array, sql_statement)
    )
  end

  # DOCU: Query multiple SELECT records to the database
  # Triggered by: Queries from different models
  def self.query_records(sql_statement)
    ActiveRecord::Base.connection.exec_query(
      ActiveRecord::Base.send(:sanitize_sql_array, sql_statement)
    )
  end

  # DOCU: Insert records to the database
  # Triggered by: Queries from different models
  def self.insert_record(sql_statement)
    ActiveRecord::Base.connection.insert(
      ActiveRecord::Base.send(:sanitize_sql_array, sql_statement)
    )
  end

  # DOCU: Delete records to the database
  # Triggered by: Queries from different models
  def self.delete_record(sql_statement)
    ActiveRecord::Base.connection.delete(
      ActiveRecord::Base.send(:sanitize_sql_array, sql_statement)
    )
  end
end
