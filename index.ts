import type { SexType } from "@faker-js/faker";
import { faker } from "@faker-js/faker";
import { promises } from "fs";

const { readFile, writeFile, appendFile, truncate } = promises;

type SubscriptionTier = "free" | "basic" | "business";

interface User {
  _id: string;
  name: string;
  phone: string;
  country_code: string;
  profile_picture: string;
  status: string;
}

function createRandomUser(): User {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const name = firstName + " " + lastName;
  const phone = faker.phone.number("###-###-####");
  const country_code = faker.phone.number("+##");
  const status = faker.word.words({ count: { min: 5, max: 10 } });
  const profile_picture = faker.image.url();

  return {
    _id: faker.string.uuid(),
    name,
    phone,
    country_code,
    profile_picture,
    status,
  };
}

const generateStringData = new Promise((resolve, reject) => {
  let stringDataBuffer = "";
  for (let i = 0; i < 100000; i++) {
    const user = createRandomUser();
    console.log(
      `Record ${i} INSERT INTO user (id, name, phone, country_code, profile_picture, status) VALUES ("${user._id}", "${user.name}", "${user.phone}", "${user.country_code}", "${user.profile_picture}", "${user.status}"); \n`
    );
    stringDataBuffer += `INSERT INTO user (id, name, phone, country_code, profile_picture, status) VALUES ("${user._id}", "${user.name}", "${user.phone}", "${user.country_code}", "${user.profile_picture}", "${user.status}"); \n`;
  }
  resolve(stringDataBuffer);
});

generateStringData.then((stringDataBuffer: any) => {
  truncate("./generated.sql", 0).finally(() => {
    console.log("removed old records");
    writeFile("./generated.sql", stringDataBuffer).then((data) => {
      console.log("generated data");
    });
  });
});
