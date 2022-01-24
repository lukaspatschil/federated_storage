import json
from utils import sendPostRequest, updatePicture, getAllEntries, deleteEntry, INPUT_FOLDER

def main():
  with open (f'{INPUT_FOLDER}/metadata.json') as file:
    metadata = json.load(file)

    print('Inserting first entry:')
    response = sendPostRequest(metadata[0])
    print(f'Entry 1 response {response.json()}')

    input('Press enter to continue...')

    print('Get all entries:')
    allEntries = getAllEntries().json()
    print(allEntries)

    input('Press enter to continue...')

    print('Inserting second entry:')
    response = sendPostRequest(metadata[1])
    print(f'Entry 2 response {response.json()}')

    input('Press enter to continue...')

    print('Get all entries:')
    allEntries = getAllEntries().json()
    print(allEntries)

    input('Press enter to continue...')

    print('Updating entry 1 with new picture:')
    response = updatePicture(allEntries[0]['id'], metadata[10]['filename'])
    print(f'Entry 1 response {response.json()}')

    input('Press enter to continue...')

    print('Get all entries:')
    allEntries = getAllEntries().json()
    print(allEntries)

    input('Press enter to continue...')

    print('Delete entry 1:')
    response = deleteEntry(allEntries[0]['id'])
    print(f'Entry 1 response {response.json()}')

    input('Press enter to continue...')

    print('Get all entries:')
    allEntries = getAllEntries().json()
    print(allEntries)

if __name__ == "__main__":
  main()