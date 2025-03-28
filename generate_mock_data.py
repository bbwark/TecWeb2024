import random
from faker import Faker
import datetime

# Initialize Faker
fake = Faker()

# Configuration
num_users = 30
num_articles = 100
output_file = "mock_data.sql"

# Generate mock data
users = []
articles = []

# Generate users
for i in range(1, num_users + 1):
    user = {
        'id': i,
        'name': "Name " + str(i),
        'username': "Usr" + str(i),
        'password': "$2b$10$bqx4qXMNvUAUoaoR2WY.9uhc3G06Nq2dwzThhoe1SIU0Y/H3zzHTK", # bcrypt hash of password ' ' (white space)
        'isAdmin': random.choice([True, False]),
        'createdAt': fake.date_time_between(start_date='-1y', end_date='now'),
        'updatedAt': fake.date_time_between(start_date='-6m', end_date='now')
    }
    users.append(user)

# Generate articles
for i in range(1, num_articles + 1):
    # Random user ID from existing users
    user_id = random.choice(users)['id']
    
    # Random date for creation and update
    created_at = fake.date_time_between(start_date='-1y', end_date='now')
    updated_at = fake.date_time_between(start_date=created_at, end_date='now')
    
    article = {
        'id': i,
        'title': fake.sentence(nb_words=6)[:-1],  # Remove period
        'subtitle': fake.sentence(nb_words=4)[:-1],
        'content': fake.paragraphs(nb=random.randint(5, 100)),
        'tags': '#' + '#'.join(fake.words(nb=random.randint(1, 5))) + '#',
        'userId': user_id,
        'createdAt': created_at,
        'updatedAt': updated_at
    }
    articles.append(article)

# Write SQL INSERT statements to file
with open(output_file, 'w') as f:
    # Write header
    f.write("-- Mock data generated for Sequelize models\n")
    f.write("-- Generated on: " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n\n")
    
    f.write("\n-- Reset sequences\n")
    f.write(f"SELECT pg_catalog.setval(pg_get_serial_sequence('\"Users\"', 'id'), 1, true);\n")
    f.write(f"SELECT pg_catalog.setval(pg_get_serial_sequence('\"Articles\"', 'id'), 1, true);\n\n")

    # Insert users
    f.write("-- Users data\n")
    for user in users:
        sql = f"""INSERT INTO \"Users\" (\"id\", \"name\", \"username\", \"password\", \"isAdmin\", \"createdAt\", \"updatedAt\") 
VALUES ({user['id']}, '{user['name'].replace("'", "''")}', '{user['username']}', '{user['password']}', {str(user['isAdmin']).lower()}, '{user['createdAt'].strftime('%Y-%m-%d %H:%M:%S')}', '{user['updatedAt'].strftime('%Y-%m-%d %H:%M:%S')}');\n"""
        f.write(sql)
    
    f.write("\n")
    
    # Insert articles
    f.write("-- Articles data\n")
    for article in articles:
        content = '\n'.join(article['content']).replace("'", "''")
        sql = f"""INSERT INTO \"Articles\" (\"id\", \"title\", \"subtitle\", \"content\", \"tags\", \"userId\", \"createdAt\", \"updatedAt\") 
VALUES ({article['id']}, '{article['title'].replace("'", "''")}', '{article['subtitle'].replace("'", "''")}',  '{content}', '{article['tags']}', {article['userId']}, '{article['createdAt'].strftime('%Y-%m-%d %H:%M:%S')}', '{article['updatedAt'].strftime('%Y-%m-%d %H:%M:%S')}');\n"""
        f.write(sql)
    
    # Reset sequences
    f.write("\n-- Reset sequences\n")
    f.write(f"SELECT pg_catalog.setval(pg_get_serial_sequence('\"Users\"', 'id'), {num_users}, true);\n")
    f.write(f"SELECT pg_catalog.setval(pg_get_serial_sequence('\"Articles\"', 'id'), {num_articles}, true);\n\n")

print(f"Generated mock data SQL file: {output_file}")