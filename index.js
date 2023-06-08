"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var faker_1 = require("@faker-js/faker");
var fs_1 = require("fs");
var readFile = fs_1.promises.readFile, writeFile = fs_1.promises.writeFile, appendFile = fs_1.promises.appendFile, truncate = fs_1.promises.truncate;
function createRandomUser() {
    var sex = faker_1.faker.person.sexType();
    var firstName = faker_1.faker.person.firstName(sex);
    var lastName = faker_1.faker.person.lastName();
    var name = firstName + " " + lastName;
    var phone = faker_1.faker.phone.number("###-###-####");
    var country_code = faker_1.faker.phone.number("+##");
    var status = faker_1.faker.word.words({ count: { min: 5, max: 10 } });
    var profile_picture = faker_1.faker.image.url();
    return {
        _id: faker_1.faker.string.uuid(),
        name: name,
        phone: phone,
        country_code: country_code,
        profile_picture: profile_picture,
        status: status,
    };
}
var generateStringData = new Promise(function (resolve, reject) {
    var stringDataBuffer = "";
    for (var i = 0; i < 100000; i++) {
        var user = createRandomUser();
        console.log("Record ".concat(i, " INSERT INTO user (id, name, phone, country_code, profile_picture, status) VALUES (\"").concat(user._id, "\", \"").concat(user.name, "\", \"").concat(user.phone, "\", \"").concat(user.country_code, "\", \"").concat(user.profile_picture, "\", \"").concat(user.status, "\"); \n"));
        stringDataBuffer += "INSERT INTO user (id, name, phone, country_code, profile_picture, status) VALUES (\"".concat(user._id, "\", \"").concat(user.name, "\", \"").concat(user.phone, "\", \"").concat(user.country_code, "\", \"").concat(user.profile_picture, "\", \"").concat(user.status, "\"); \n");
    }
    resolve(stringDataBuffer);
});
generateStringData.then(function (stringDataBuffer) {
    truncate("./generated.sql", 0).finally(function () {
        console.log("removed old records");
        writeFile("./generated.sql", stringDataBuffer).then(function (data) {
            console.log("generated data");
        });
    });
});
