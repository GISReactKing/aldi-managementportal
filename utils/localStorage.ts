// import localStorage from '@react-native-async-storage/async-storage';

const storeObjectData = async (key: string, data: any) => {
  try {
    const jsonValue = JSON.stringify(data);

    localStorage.setItem(key, jsonValue);
  } catch (error) {
    // Error saving data
    console.log('error saving', error);
  }
};
const storeData = async (key: string, data: any) => {
  try {
    localStorage.setItem(key, data);
  } catch (error) {
    // Error saving data
    console.log('error saving', error);
  }
};

const retrieveData = async (item: any) => {
  try {
    const value = localStorage.getItem(item);
    if (value !== null) {
      // We have data!!
      console.log(value);
      return value;
    }
  } catch (error) {
    // Error retrieving data
  }
};
const retrieveObjectData = async (key: string) => {
  try {
    const jsonValue = localStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    // Error retrieving data
    console.log(error);
  }
};

const clearAll = async () => {
  try {
    localStorage.clear();
  } catch (e) {
    // clear error
  }

  console.log('Done.');
};

const clearByKey = async (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // clear error
  }

  console.log('Done.');
};

export {
  retrieveData,
  storeData,
  clearAll,
  storeObjectData,
  retrieveObjectData,
  clearByKey,
};
