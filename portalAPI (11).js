/* eslint-disable */

/** 
 * @typedef {Map<String, any>} ServerInfo
 * @param {String} version The version the server is currently running.
 * @private
 * @class
 */
class ServerInfo extends Map {
    constructor(version) {
        this.version = version;
    }
}
/**
 * @typedef {Map<String, any>} postObject
 * @param {String} id Action ID.
 * @private
 * @class
 */
class postObject extends Map {
    constructor(id) {
        this.id = id;
    }
}
/**
 * @typedef {Map<String, String>} URLObjectData
 * @param {String} username 
 * @param {String} password
 * @private
 * @class
 */
class URLObjectData extends Map {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}
/**
 * @typedef {Map<String, String | Number | Boolean | Array | Map>} ProfileObject
 * @param {String} username Username of the user
 * @param {Number} accessLevel The access level of the user
 * @private
 * @class
 */
class ProfileObject extends Map {
    constructor(username, accessLevel) {
        this.username = username;
        this.accessLevel = accessLevel;
    }
}
/**
 * @typedef {Map<String, String>} FileObject
 * @param {String} fileName File name
 * @param {String} link URL to the file 
 * @private
 * @class
 */
class FileObject extends Map {
    constructor(fileName, link) {
        this.fileName = fileName;
        this.link = link;
    }
}
/**
 * @typedef {Map<String, String|Number>} HomeworkObject
 * @param {String} subject Subject
 * @param {String} content Content
 * @param {Number} date Date
 * @param {Number} month Month 
 * @param {Number} year Year in YYYY format
 * @param {String} type The type of the homework
 * @private
 * @class
 */
class HomeworkObject extends Map {
    constructor(subject, content, date, month, year, type) {
        this.subject = subject;
        this.content = content;
        this.date = date;
        this.month = month;
        this.year = year;
        this.type = type;
    }
}
/**
 * @typedef {Map<String, String|Number>} PersonalDataObject
 * @param {String} username Username
 * @param {Number} accessLevel Access level
 * @private
 * @class
 */
class PersonalDataObject extends Map {
    constructor(username, accessLevel) {
        this.username = username;
        this.accessLevel = accessLevel;
    }
}
/**
 * @typedef {Map<String, any>} ALSDDataObject 
 * @private
 * @class
 */
class ALSDDataObject extends Map {
    constructor() {

    }
}
const doNotLoadForge = true;
var t0 = performance.now();
var variableAddress = "https://skool.quvia.cz/#"; //25.120.112.139
/**
 * @description The Quvia object
 */

var q = {
    /**
     * @summary Reloads the window.
     * @description Reloads the window. Use this insted of pure window.location.reload() to reload potentialy stored variables.
     * @returns {void}
     */
    restart: () => {
        window.location.reload();
    },
    /**
     * @deprecated
     * @summary Requsts a user login.
     * @description Checks, if the user is logged in. If not, redirects him to the login page with parameter to continue to window.location.href after login.
     * @returns {Promise<User>} q.User
     */
    userRequest: async () => {
        var abcd = await q.requestLogin();
        return abcd;
    },
    /**
     * @summary Return server information.
     * @description Requests server information from the server.
     * @returns {Promise<ServerInfo>}
     */
    getServerInfo: async () => {
        var a = await q.https.sendPost(q.db.ip, {
            id: "getServerInfo"
        });
        return JSON.parse(a.response);
    },
    /**
     * @summary Requsts a user login.
     * @description Checks, if the user is logged in. If not, redirects him to the login page with parameter to continue to window.location.href after login.
     * @returns {Promise<User>} q.User 
     */
    requestLogin: async () => {
        if (window.location.href.split("?")[0] == q.db.loginPage || window.location.href.split("?")[0] == q.db.loginPage + "index.html") return console.log("Not continuing, on Login page.");
        if (!(typeof doNotRedirect === 'undefined' || doNotRedirect == false)) {
            window.location.href = q.db.loginPage;
            user = "failed"
            return user;
        }
        if (q.retrievedData.username && q.retrievedData.verificationKey) {
            var a = await new q.User(q.retrievedData.username, q.retrievedData.verificationKey).checkVKey();
            if (a) {
                q.saveLocal(new q.User(q.retrievedData.username, q.retrievedData.verificationKey));
                user = new q.User(q.retrievedData.username, q.retrievedData.verificationKey);
                return user;
            } else {
                localStorage.clear();
            }
        } else if (localStorage.getItem("username") && localStorage.getItem("verificationKey")) {
            var a = await new q.User(localStorage.getItem("username"), localStorage.getItem("verificationKey")).checkVKey();
            if (a) {
                user = new q.User(localStorage.getItem("username"), localStorage.getItem("verificationKey"))
                return user;
            }
        }
        q.data.parse(q.db.loginPage, {
            next: window.location.href
        });

    },
    /**
     * @param {User} user User, whos data is saved.
     * @summary Saves users data to local storage.
     * @description Saves username and verfication key of the user to local storage for potential page refresh. This does not get deleted on q.reload().
     * @returns {void}
     */
    saveLocal: user => {
        localStorage.setItem("username", user.username);
        localStorage.setItem("verificationKey", user.verificationKey);
    },
    /**
     * @todo This function is not yet implemented.
     */
    loginGoogle: async (username, token) => {
        var a = await q.https.sendPost(q.db.ip, {
            id: "login",
            username: username,
            token: token
        });
        switch (a.status) {
            case 799:
                throw new Error("Unexpected server security error, please contact Quvia support. Error code: qlon799$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
            case 788:
                throw new Error(a.responseText);
            case 777:
                throw new Error("Unexpected server execution error, please contact Quvia support or try later. Error code: qlon777$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
            case 703:
                throw new Error("Non-existing user!");
            case 796:
                throw new Error("Account suspended!");
            case 200:
                return new q.User(username, JSON.parse(a.responseText).verificationKey);
        }
    },
    /**
     * @param {String} username Username to use for the login.
     * @param {String} password Password to use for the login.
     * @summary Logs the user in.
     * @description Uses provided username and password to attempt a login. If successful, returns User object, if faild throws Error.
     * @returns {Promise<User>}
     */
    login: async (username, password) => {
        var a = await q.https.sendPost(q.db.ip, {
            id: "login",
            username: username,
            password: password
        });
        switch (a.status) {
            case 799:
                throw new Error("Unexpected server security error, please contact Quvia support. Error code: qlon799$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
            case 790:
                throw new Error("Incorrect password!");
            case 777:
                throw new Error("Unexpected server execution error, please contact Quvia support or try later. Error code: qlon777$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
            case 703:
                throw new Error("Non-existing user!");
            case 796:
                throw new Error("Account suspended!");
            case 710:
                switch (a.responseText) {
                    case "username":
                        throw new Error("Username not provided for login. Error code: qlon710uname$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
                    case "password":
                        throw new Error("Password not provided for login. Error code: qlon710passw$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
                }
            case 700:
                throw Error("Unexpected database return, please contact Quvia support. Error code: qlon700$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
            case 200:
                return new q.User(username, JSON.parse(a.responseText).verificationKey);
            default:
                throw new Error("Unexpected server error, please contact Quvia support. Error code: qlonx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
        }
    },
    /**
     * @param {String} username The username used to register the user.
     * @param {String} password The password used to register the user.
     * @param {String} discord The discord tag of the user.
     * @param {Number} securityLevel Hash rounds use to protect users password. More rounds are safer, but take more time to login. Default: 10.
     * @param {String | Map<String, String} name The name of the user.
     * @summary Registers a user.
     * @description Sends a registration request to the server. If successful, returns true, else throws an error.
     * @return {Promise<Boolean>}
     */
    register: async (username, password, discord, securityLevel = 10, name) => {

        var n = {};
        if (typeof name == "string") {
            n.gName = name.split(" ")[0];
            n.sName = name.split(" ")[1];
        }
        if (typeof name == "object") {
            n.gName = name.givenName;
            n.sName = name.surname;
        }
        var a = await q.https.sendPost(q.db.ip, {
            id: "register",
            username: username,
            password: password,
            discord: discord,
            securityLevel: securityLevel,
            name: n
        });
        switch (a.status) {
            case 701:
                throw new Error("Unexpected server error, please contact Quvia support. Error code: qrer701$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
            case 702:
                throw new Error("Unexpected server error, please contact Quvia support. Error code: qrer702$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
            case 721:
                throw new Error("Username is already in use!");
            case 799:
                throw new Error("Unexpected server security error, please contact Quvia support. Error code: qrer799$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
            case 500:
                throw new Error("Unexpected server error, please contact Quvia support. Error code: qrer500$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
            case 796:
                throw new Error("Account suspended!");
            case 710:
                switch (a.responseText) {
                    case "username":
                        throw new Error("Username not provided for registration. Error code: qrer710uname$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
                    case "password":
                        throw new Error("Password not provided for registration. Error code: qrer710passw$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
                    case "discord":
                        throw new Error("Discord Tag not provided for registration. Error code: qrer710discord$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
                }
            case 200:
                return true;
            default:
                throw new Error("Unexpected server error, please contact Quvia support. Error code: qrerx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
        }
    },
    /**
     * @summary Public interface
     * @description Functions, for which you don't need a user to be loged in.
     */
    public: {
        /**
         * @param {Number} id The id of the file you want to get.
         * @summary Gets file with public access.
         * @description Attempts to get the file with the id provided.
         */
        getFile: async id => {
            return await (await q.login("public", "public")).getFile(id);
        },
        /**
         * @summary Gets all public files.
         * @description Attempts to get all the files with public read access.
         */
        getAllFiles: async () => {
            return await (await q.login("public", "public")).getAllFiles();
        },
        /**
         * @param {String} filename Name of the file.
         * @param {String} link Download link to the file via http or https protocol.
         * @summary Adds a file as public.
         * @description Attempts to add a file as public user. File will have public read access.
         */
        addFile: async (filename, link) => {
            return await (await q.login("public", "public")).addFile(filename, link);
        },
        /**
         * @param {Number} id Id of the file.
         * @summary Downloads a file.
         * @description Attempts to get a link to the file with the id. Then opens that link in a new tab to download it.
         * @returns {Promise<void>}
         */
        downloadFile: async id => {
            return await (await q.login("public", "public")).downloadFile(id);
        }
    },
    /**
     * @deprecated
     */
    getAllInputShares: async () => {
        var a = await q.https.sendPost(q.db.ip, {
            id: "inputShare/getAll",
        });
        if (a.status == 200) {
            return JSON.parse(a.responseText).responses;
        } else {
            return a.status;
        }
    },
    /**
     * @deprecated
     */
    setInputShare: async (uniqueID, val) => {
        var a = await q.https.sendPost(q.db.ip, {
            id: "inputShare/set",
            uniqueID: uniqueID,
            val: val
        });
        return a.status == 200;
    },
    /**
     * @summary Https interaction object.
     * @description Object containing functions for interaction with the https protocol.
     */
    https: {
        /**
         * @param {String} address The URL adress to which the request should be sent.
         * @summary Sends a get request.
         * @description Attempts to send a get request to the URL.
         * @returns {Promise<XMLHttpRequest>}  
         */
        sendGet: address => {
            var req = new XMLHttpRequest();
            return new Promise(function (resolve, reject) {
                req.onreadystatechange = () => {
                    if (req.readyState != 4) return;
                    resolve(req);
                }
                req.open("GET", address, true);
                req.send();
            });
        },
        /**
         * @param {String} address The URL adress to which the request should be sent.
         * @param {PostObject} postObject Object containing data, that will be sent to the server as a JSON string.
         * @summary Sends a get request.
         * @description Attempts to send a get request to the URL.
         * @returns {Promise<XMLHttpRequest>}  
         */
        sendPost: (address, postObject) => {
            var req = new XMLHttpRequest();
            return new Promise(function (resolve, reject) {
                req.onreadystatechange = () => {
                    if (req.readyState != 4) return;
                    resolve(req);
                }
                req.open("POST", address, true);
                req.send(JSON.stringify(postObject));
            });
        }
    },
    /**
     * @summary Database
     * @description Static information from the server.
     */
    db: {
        /**
         * @summary The IP adress
         * @description IP address of the API server
         */
        ip: "https://quvia.cz:4443/",
        /**
         * @summary The login page
         * @description Page to which a user is redirected for login
         */
        loginPage: 'https://auth.quvia.cz/',
        /**
         * @summary The home page
         * @description Default page
         */
        homePage: variableAddress + "/",
        /**
         * @deprecated
         */
        sessionTerminatedPage: variableAddress + "/pages/terminated",
        /**
         * @summary The files page
         * @description Default page for files
         */
        filesPage: variableAddress + "/files",
        /**
         * @summary The error 404 page
         * @description The page the user is redirected to, when a critical resource returns 404.
         */
        err404Page: variableAddress + "pages/error-404"
    },
    /**
     * @summary URL data interaction object
     * @description Object containing functions for interaction with data in the URL
     */
    data: {
        /**
         * @param {String} redirectLink URL of the page, the user is supposed to be redirected to.
         * @param {URLObjectData} objectData Object, that should be parsed to the page.
         * @summary Redirects user to another web page with JSON URL encoded data.
         * @description Encodes data using modified JSON encoding, that is unlikely to be detected by automated software, then sends it to the next web page via the URL.
         * @returns {void}
         */
        parse: (redirectLink, objectData) => {
            var urlEncoded = "",
                urlEncodedPairs = [],
                name;
            for (name in objectData) {
                urlEncodedPairs.push(encodeURIComponent(name) + "=" + encodeURIComponent(objectData[name]));
            }
            console.log(urlEncodedPairs);
            urlEncoded = urlEncodedPairs.join("&").replace(/%20/g, "+");
            window.location.href = absolutePath(redirectLink) + "?" + urlEncoded;
        },
        /**
         * @summary Retrieves data form the URL
         * @description Decodes data parsed by the q.data.parse() and removes data from the URL
         * @returns {URLObjectData}
         */
        retrieve: () => {
            var decoded = decodeURI(window.location.href);
            try {
                var params = decoded.split("?")[1].split("&");
            } catch (e) {
                console.log(e);
                return {};
            }
            var sparams = params.map(r => decodeURIComponent(r).split("="));
            var rv = {};
            for (var sparam of sparams) {
                rv[sparam[0]] = sparam[1];
            }
            history.pushState(null, null, window.location.href.split("?")[0]);
            return rv;
        }
    },
    /**
     * @summary Represents a registration that is waiting for approval 
     * @description Object representing a registration that is waiting for approval by the administrator
     */
    PendingRegistration: class PendingRegistration {
        /**
         * @param {String} username Username of the user
         */
        constructor(username) {
            this.username = username;
        }
        /**
         * @param {String} email 
         * @summary Adds email to the pending registration. 
         * @description Attempts to add and email to a pending registration. If successful, returns true, else throws an error.
         * @returns {Boolean}
         */
        async addEmail(email) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "extraLoginData/addEmail",
                username: this.username,
                email: email
            });
            switch (a.status) {
                case 787:
                    throw new Error("You can not modify this resource!");
                case 200:
                    return true;

            }
        }
        /**
         * @todo
         * @param {String} token 
         */
        async selfApproveByGoole(token) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "self-approveByGoogle",
                username: this.username,
                token: token
            });
            switch (a.status) {
                case 787:
                    throw new Error("You can not modify this resource!");
                case 788:
                    throw new Error(a.responseText)
                case 200:
                    return true;

            }
        }
    },
    /**
     * @summary Object resembling a Quvia User object
     * @description The User object is used to execute most of API interactions.
     */
    User: class User {
        /** 
         * @param {String} username Username of the user
         * @param {String} verificationKey Currently validated verification key
         * @summary Constructs the User object 
         * @description The User object is used to execute most of API interactions.
         */
        constructor(username, verificationKey) {
            this.username = username;
            this.verificationKey = verificationKey;
        }
        /**
         * @summary Get the profile of the user.
         * @description Attempts to retrieve users profile information from the server.
         * @returns {Promise<ProfileObject>}
         */
        async getProfile() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "getUserProfile",
                username: this.username,
                verificationKey: this.verificationKey
            });
            switch (a.status) {
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 797:
                    throw new Error("You do not have access to perform this action!");
                case 796:
                    throw new Error("Account suspended!");
                case 200:
                    return JSON.parse(a.responseText);

            }
        }
        /**
         * @param {String} username The username of the user, whos profile is requested.
         * @summary Gets the profile of another user.
         * @descrption Attempts to retrieve profile information about a different user from the server. This is an ADMIN-ONLY function.
         * @returns {Promise<ProfileObject>}
         */
        async getUserProfile(username) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "admin/getUserProfile",
                username: this.username,
                verificationKey: this.verificationKey,
                targetUser: username
            });
            switch (a.status) {
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 797:
                    throw new Error("You do not have access to perform this action!");
                case 796:
                    throw new Error("Account suspended!");
                case 200:
                    return JSON.parse(a.responseText);

            }
        }
        /**
         * @param {String} targetUser Username of user, whos registration should be approved
         * @param {Number} accessLevel Accessl level, that should be assigned to the user
         * @summary Approves a registration for a user
         * @description Attempts to approve a registration with a specified access level. This is an ADMIN-ONLY function.
         * @returns {Promise<Boolean>}
         */
        approveRegistration(targetUser, accessLevel) {
            return new Promise((resolve, reject) => {
                q.https.sendPost(q.db.ip, {
                    id: "approveRegistration",
                    username: this.username,
                    verificationKey: this.verificationKey,
                    targetUser: targetUser,
                    accessLevel: accessLevel
                }).then(a => {
                    switch (a.status) {
                        case 700:
                            throw new Error("Unexpected database return, please contact Quvia support. Error code: qarn700$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
                        case 777:
                            throw new Error("Unexpected execution error, please contact Quvia support or try again later. Error code: qarn777$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
                        case 703:
                            throw new Error("Username does not exist!");
                        case 796:
                            throw new Error("Account suspended!");
                        case 791:
                            q.requestLogin();
                            throw new Error("Invalid verfication key");
                        case 710:
                            switch (a.responseText) {
                                case "username":
                                    throw new Error("Username not provided for approveRegistration. Error code: qarn710uname$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
                                case "verificationKey":
                                    q.requestLogin();
                                    throw new Error("Password not provided for login. Error code: qarn710vkey$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime());
                            }
                        case 200:
                            resolve(true);
                            break;
                        default:
                            throw new Error("Unexpected server error, please contact Quvia support. Error code: qarnx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
                    }
                })
            })
        }
        /**
         * @param {String} id Id of the response
         * @param {String} enText Text of the response in english
         * @deprecated
         */
        addDiscordResponse(id, enText) {
            return new Promise((resolve, reject) => {
                q.https.sendPost(q.db.ip, {
                    id: "addDiscordResponse",
                    responseId: id,
                    enText: enText,
                    username: this.username,
                    verificationKey: this.verificationKey
                }).then(a => {
                    switch (a.status) {
                        case 710:
                            throw new Error("Not all required arguments provided, please provide: " + a.responseText);
                        case 721:
                            throw new Error("Response already exists!");
                        case 796:
                            throw new Error("Account suspended!");
                        case 791:
                            q.requestLogin();
                            throw new Error("Invalid vKey!");
                        case 797:
                            throw new Error("You do not have access to perform this action!");
                        case 200:
                            resolve(true);
                            break;
                        default:
                            throw new Error("Unexpected server error, please contact Quvia support. Error code: qadrx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
                    }
                })
            })
        }
        /**
         * @summary Gets usernames of all users
         * @description Attempts to retrieve usernames of all users. This function is access limited.
         * @returns {Promise<Array<string>>}
         */
        async getAllUsers() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "getAllUsers",
                username: this.username,
                verificationKey: this.verificationKey
            });
            switch (a.status) {
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("You do not have access to perform this action!");
                case 200:
                    return JSON.parse(a.responseText);

            }
        }
        /**
         * @param {String} id Id of the file.
         * @summary Gets a file with the specified ID
         * @description Attempts to retrieve the file with the specified ID. This action may get rejected due to restricted access.
         * @returns {Promise<FileObject>}
         */
        getFile(id) {
            return new Promise((resolve, reject) => {
                q.https.sendPost(q.db.ip, {
                    id: "files/get",
                    responseId: id,
                    fileId: id,
                    username: this.username,
                    verificationKey: this.verificationKey
                }).then(a => {
                    switch (a.status) {
                        case 791:
                            q.requestLogin();
                            throw new Error("Invalid vKey!");
                        case 796:
                            throw new Error("Account suspended!");
                        case 798:
                            throw new Error("You do not have access to this file!")
                        case 200:
                            resolve(a.responseText);
                            break; //lunchbreak
                        default:
                            throw new Error("Unexpected server error, please contact Quvia support. Error code: qgfex$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);

                    }
                })
            })
        }
        /**
         * @param {Array<String>} emails Email addresses to be added
         * @todo
         */
        async addTrustedEmails(emails) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "admin/addTrustedEmails",
                username: this.username,
                verificationKey: this.verificationKey,
                emails: emails
            })
            switch (a.status) {
                case 200:
                    return a.responseText == "true";
            }
        }
        /**
         * @summary Gets all fund transactions
         * @description Attempts to retrieve all fund transactions.
         */
        async getAllTransactions() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "fund/getAllTransactions",
                username: this.username,
                verificationKey: this.verificationKey,
            })
            switch (a.status) {
                case 200:
                    return JSON.parse(a.responseText).transactions;
            }
        }
        /**
         * @summary Gets all fund payments
         * @description Attempts to retrieve all fund payments
         * @returns {Array<Map<String, Boolean | Number>>}
         */
        async getPayments() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "fund/getPayments",
                username: this.username,
                verificationKey: this.verificationKey,
            })
            switch (a.status) {
                case 200:
                    return JSON.parse(a.responseText).payments;
                case 796:
                    throw new Error("Access deniend.");
            }
        }
        /**
         * @summary Gets all fund payments
         * @description Attempts to retrieve all fund payments
         * @param {String} description
         * @returns {Array<void>}
         */
        async markPaymentAsPaid(description) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "fund/markPaymentAsPaid",
                username: this.username,
                verificationKey: this.verificationKey,
                description: description
            })
            switch (a.status) {
                case 200:
                    return;
                case 796:
                    throw new Error("Access deniend.");
            }
        }
        /**
         * @summary Gets roles
         * @description Attempts to retrieve roles of the user
         * @returns {Promise<Array<Map<String, String | Number | Boolean>>}
         */
        async getRoles() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "getRoles",
                username: this.username,
                verificationKey: this.verificationKey,
            })
            switch (a.status) {
                case 200:
                    return JSON.parse(a.responseText);
                case 796:
                    throw new Error("Account suspended!");
            }
        }
        /**
         * @summary Gets name of roles
         * @description Attempts to retrieve names of roles of the user
         * @returns {Promise<Array<String>>}
         */
        async getRoleNames() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "getRoles",
                username: this.username,
                verificationKey: this.verificationKey,
            })
            switch (a.status) {
                case 200:
                    return JSON.parse(a.responseText).map(r => r.name);
                case 796:
                    throw new Error("Account suspended!");
            }
        }
        /**
         * @summary Gets the balance of the fund
         * @description Attempts to retrieve the balance of the fund.
         * @returns {Promise<Number>}
         */
        async getBalance() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "fund/getBalance",
                username: this.username,
                verificationKey: this.verificationKey,
            })
            switch (a.status) {
                case 200:
                    return JSON.parse(a.responseText).balance;
            }
        }
        /**
         * @summary Adds transaction
         * @description Attempts to add a transaction. Fund Manager role required.
         * @param {Number} amount The size of the transaction
         * @param {Boolean} colectivePayment If the transaction is a part of a collective payment
         * @param {String} counterparty The counterparty of the transaction
         * @param {String} description Description of the transaction
         * @param {String} direction Direction of the transaction (in/out)
         * @param {String} id Id of the transaction
         * @returns {Promise<Boolean>}
         */
        async addTransaction(amount, colectivePayment, counterparty, description, direction, id) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "fund/addTransaction",
                username: this.username,
                verificationKey: this.verificationKey,
                amount,
                colectivePayment,
                counterparty,
                description,
                direction,
                transactionId: id
            })
            switch (a.status) {
                case 200:
                    return true;
                case 791:
                    throw new Error("Access denied.");
                case 710:
                    throw new Error("Argument not provided." + a.responseText);
            }
        }
        /**
         * @summary Adds payment
         * @description Attempts to add payment for the user.
         * @param {Number} amount Amount of the payment
         * @param {Stirng} user Username of the user who pays this payments
         * @param {String} description Description of the payment. Should be the same for all colective payments.
         * @param {Boolean} cumulateInterest Whether or not to cumulate interest, if the user does not pay the payment.
         * @param {Number} due The timestamp of the due date.
         * @returns {Promise<Boolean>}
         */
        async addPayment(amount, user, description, cumulateInterest, due) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "fund/addPayment",
                username: this.username,
                verificationKey: this.verificationKey,
                amount,
                user,
                description,
                cumulateInterest,
                due
            })
            switch (a.status) {
                case 200:
                    return true;
                case 791:
                    throw new Error("Access denied.");
            }
        }
        /**
         * @summary Checks users verification key.
         * @description Attempts to verify a users verification key. If successful, returns true, else throws an error or redirects to login page.
         * @returns {Promise<boolean>}
         */
        async checkVKey() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "checkVKey",
                username: this.username,
                verificationKey: this.verificationKey
            });
            switch (a.status) {
                case 791:
                    return false;
                case 798:
                    throw new Error("You do not have access to this file!")
                case 796:
                    throw new Error("Account suspended!");
                case 710:
                    throw new Error("Required argument not provided. Argument: " + a.responseText)
                case 200:
                    return true;
            }
        }
        /**
         * @param {String} id The id of the file to download
         * @summary Downloads a file with the ID
         * @description Attempts to retrieve the link to the file, then opens that link in a new tab.
         * @returns {Promise<void>}
         */
        downloadFile(id) {
            return new Promise((resolve, reject) => {
                q.https.sendPost(q.db.ip, {
                    id: "files/get",
                    fileId: id,
                    username: this.username,
                    verificationKey: this.verificationKey
                }).then(a => {
                    console.log(a);

                    switch (a.status) {
                        case 791:
                            q.requestLogin();
                            throw new Error("Invalid vKey!");
                        case 798:
                            throw new Error("You do not have access to this file!")
                        case 796:
                            throw new Error("Account suspended!");
                        case 710:
                            throw new Error("Required argument not provided. Argument: " + a.responseText)
                        case 200:
                            window.open(JSON.parse(a.responseText).link);
                            break;
                        default:
                            throw new Error("Unexpected server error, please contact Quvia support. Error code: qgfex$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);

                    }
                })
            })
        }
        /**
         * @summary Gets all files the user has read access to.
         * @description Attempts to retrieve all files the user has read access to.
         * @return {Promise<Array<FileObject>>}
         */
        getAllFiles() {
            return new Promise((resolve, reject) => {
                q.https.sendPost(q.db.ip, {
                    id: "files/getAll",
                    username: this.username,
                    verificationKey: this.verificationKey
                }).then(a => {
                    switch (a.status) {
                        case 791:
                            q.requestLogin();
                            throw new Error("Invalid vKey!");
                        case 796:
                            throw new Error("Account suspended!");
                        case 200:
                            resolve(JSON.parse(a.responseText));
                            break;
                        default:
                            throw new Error("Unexpected server error, please contact Quvia support. Error code: qgfax$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
                    }
                })
            });
        }
        /**
         * @param {String} targetUser
         * @summay Suspends users account
         * @description Attempts to send a request to suspend a users account. If successful, returns true, else throws an error.
         * @returns {Promise<Boolean>}
         */
        async suspendUser(targetUser) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "admin/suspendUser",
                username: this.username,
                verificationKey: this.verificationKey,
                targetUser: targetUser
            })
            switch (a.status) {
                case 791:
                    q.requestLogin();
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("You don't have access to perform this action!");
                case 200:
                    return true;
            }
        }
        /**
         * @param {String} targetUser
         * @summay Unsuspends users account
         * @description Attempts to send a request to unsuspend a users account. If successful, returns true, else throws an error.
         * @returns {Promise<Boolean>}
         */
        async unsuspendUser(targetUser) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "admin/unsuspendUser",
                username: this.username,
                verificationKey: this.verificationKey,
                targetUser: targetUser
            })
            switch (a.status) {
                case 791:
                    q.requestLogin();
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("You don't have access to perform this action!");
                case 200:
                    return true;
            }
        }
        /**
         * @deprecated
         */
        async saveStatisticalReport() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "saveStats",
                username: this.username,
                verificationKey: this.verificationKey
            })
            switch (a.status) {
                case 791:
                    q.requestLogin();
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("You don't have access to perform this action!");
                case 200:
                    return a.responseText == "true";
            }
        }
        /**
         * @param {String} filename Name of the file to be added
         * @param {String} link URL to the file 
         * @summary Adds a file
         * @description Creates a file entery with the file name and link. File will be private to the user.
         * @returns {Promise<Number>} File id 
         */
        addFile(filename, link) {
            return new Promise((resolve, reject) => {
                q.https.sendPost(q.db.ip, {
                    id: "files/add",
                    username: this.username,
                    verificationKey: this.verificationKey,
                    fileName: filename,
                    fileLink: link
                }).then(a => {
                    switch (a.status) {
                        case 791:
                            q.requestLogin();
                            throw new Error("Invalid vKey!");
                        case 796:
                            throw new Error("Account suspended!");
                        case 200:
                            resolve(Number(a));
                            break;
                        default:
                            throw new Error("Unexpected server error, please contact Quvia support. Error code: qafex$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
                    }
                })
            })
        }
        /**
         * @summary Gets all Homework
         * @description Attempts to retrieve all homework.
         * @return {Promise<Array<HomeworkObject>>}
         */
        async getAllHw() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "hw/getAll",
                username: this.username,
                verificationKey: this.verificationKey,
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 796:
                    throw new Error("Account suspended!");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return JSON.parse(a.responseText);
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qhwgax$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);

            }
        }
        /**
         * @param {Number} year The year
         * @summary Gets all Homework for the year
         * @description Attempts to retrieve all homework mathing the given year.
         * @return {Promise<Array<HomeworkObject>>}
         */
        async getYearHw(year) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "hw/getYear",
                username: this.username,
                verificationKey: this.verificationKey,
                date: {
                    year: year
                }
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return JSON.parse(a.responseText);
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qhwgyx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);

            }
        }
        /**
         * @param {Number} month The month
         * @param {Number} year The year
         * @summary Gets all Homework for the month in a year
         * @description Attempts to retrieve all homework mathing the given year and month.
         * @return {Promise<Array<HomeworkObject>>}
         */
        async getMonthHw(month, year) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "hw/getMonth",
                username: this.username,
                verificationKey: this.verificationKey,
                date: {
                    month: month,
                    year: year
                }
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return JSON.parse(a.responseText);
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qhwgmx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);

            }
        }
        /**
         * @param {Number} date The date
         * @param {Number} month The month
         * @param {Number} year The year
         * @summary Gets all Homework for the day in a month in a year
         * @description Attempts to retrieve all homework mathing the given year, month and date.
         * @return {Promise<Array<HomeworkObject>>}
         */
        async getHw(date, month, year) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "hw/get",
                username: this.username,
                verificationKey: this.verificationKey,
                date: {
                    date: date,
                    month: month,
                    year: year
                }
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return JSON.parse(a.responseText);
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qhwgx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
            }
        }
        /**
         * 
         * @param {String} email E-mail address
         * @summary Adds E-Mail to the account.
         * @description Attempts to add an E-Mail the users account.
         * @returns {Promise<void>}
         */
        async addEmail(email) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "addEmail",
                username: this.username,
                verificationKey: this.verificationKey,
                email: email
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return true;
            }
        }
        /**
         * @param {Number} date The day-in-month date of the homework in DD format
         * @param {Number} month The month of the homework in MM format
         * @param {Number} year The year of the homework in YYYY format
         * @param {String} subject The subject, from which the homework is
         * @param {String} content The content of the homework
         * @param {String} type The type of the homework
         * @summary Adds a homework
         * @description Attempts to add a homework with the specified information to the database. This action is access limited. 
         * @returns {Promise<boolean>}
         */
        async addHw(date, month, year, subject, content, type) {
            if (!["hw", "test", "long-term", "field-trip", undefined].includes(type)) throw new Error("Argument type must be hw/test/field-trip/long-term");
            var a = await q.https.sendPost(q.db.ip, {
                id: "hw/add",
                username: this.username,
                verificationKey: this.verificationKey,
                date: {
                    date: date,
                    month: month,
                    year: year
                },
                subject: subject,
                content: content,
                type: type
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return true;
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qhwax$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
            }
        }
        /**
         * @summary Gets users personal data.
         * @description Attemps to retrieve the users personal data object from the server.
         * @returns {Promise<PersonalDataObject>}
         */
        async getPersonalData() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "personalData/get",
                username: this.username,
                verificationKey: this.verificationKey
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return JSON.parse(a.responseText);
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qgpdx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
            }
        }
        /**
         * @param {String} key The object key, to which the value will be assigned.
         * @param {String} value The value, that will be assigned to the key.
         * @summary Sets a parameter of the personal data object the value
         * @description Attempts to modify the personal data object on the server, overwiting value for the key with a new value.
         * @returns {Promise<Boolean>}
         */
        async setPersonalData(key, value) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "personalData/set",
                username: this.username,
                verificationKey: this.verificationKey,
                key: key,
                value: value
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return true;
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qspdx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
            }

        }
        /**
         * @param {Number} writeAccessLevel The write access level
         * @param {Number} readAccessLevel The read access level
         * @summary Gets access level specific data for the levels provided
         * @description Attempts to retrun an object specific to the given access levels. Access level specific data objects a unique for each combination of access levels. This function is access restricted.
         */
        async getALSD(writeAccessLevel, readAccessLevel) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "alsd/get",
                username: this.username,
                verificationKey: this.verificationKey,
                writeAccessLevel: writeAccessLevel,
                readAccessLevel: readAccessLevel
            })
            switch (a.status) {
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return JSON.parse(a.responseText)
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qalsdgx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status + " Response: " + a.responseText);

            }
        }
        /**
         * @param {Number} writeAccessLevel The write access level
         * @param {Number} readAccessLevel The read access level
         * @param {ALSDDataObject | Map<String, any>} data An object representing 
         * @summary Gets access level specific data for the levels provided
         * @description Attempts to retrun an object specific to the given access levels. Access level specific data objects a unique for each combination of access levels. This function is access restricted.
         * @returns {Promise<boolean>}
         */
        async setALSD(writeAccessLevel, readAccessLevel, data) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "alsd/set",
                username: this.username,
                verificationKey: this.verificationKey,
                writeAccessLevel: writeAccessLevel,
                readAccessLevel: readAccessLevel,
                data: data
            })
            switch (a.status) {
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return true;
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qalsdsx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status + " Response: " + a.responseText);

            }
        }
        /**
         * @summary Logs the user out
         * @description Deletes users verification key and username from local storage a attempts to invalidate the key with the server.
         * @returns {Promise<Boolean>}
         */
        logout() {
            return new Promise((resolve, reject) => {
                q.https.sendPost(q.db.ip, {
                    id: "logout",
                    username: this.username,
                    verificationKey: this.verificationKey
                }).then(a => {
                    switch (a.status) {
                        case 791:
                            q.requestLogin();
                            throw new Error("Invalid vKey!");
                        case 796:
                            throw new Error("Account suspended!");
                        case 200:
                            resolve(true);
                            break;
                        default:
                            throw new Error("Unexpected server error, please contact Quvia support. Error code: qlotx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
                    }
                })
            })
        }
        /**
         * 
         * @param {String} newPassword New password for the user
         * @summary Changes users password
         * @description Attempts to change users password.
         * @returns {Promise<void>}
         */
        changePassword(newPassword) {
            return new Promise((resolve, reject) => {
                q.https.sendPost(q.db.ip, {
                    id: "changePassword",
                    username: this.username,
                    verificationKey: this.verificationKey,
                    password: newPassword
                }).then(a => {
                    switch (a.status) {
                        case 791:
                            q.requestLogin();
                            throw new Error("Invalid vKey!");
                        case 796:
                            throw new Error("Account suspended!");
                        case 200:
                            resolve(true);
                            break;
                        default:
                            throw new Error("Unexpected server error, please contact Quvia support. Error code: qcpdx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
                    }
                })
            })
        }
        /**
         * 
         * @param {String} message The message you want to send
         * @summary Sends message to the texting channel 
         * @description Attempts to send a discord message to the texting channel in the Quvia server. This action is ADMIN-ONLY.
         * @returns {Promise<Boolean>};
         */
        async sendDiscordTextingMessage(message) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "discord/texting/send",
                username: this.username,
                verificationKey: this.verificationKey,
                content: message
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return true;
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qdtmx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
            }
        }
        /**
         * @deprecated
         * @param {String} message The message you want to send
         * @summary Sends message to the omg channel 
         * @description Attempts to send a discord message to the omg channel in the Quvia server. This action is ADMIN-ONLY.
         * @returns {Promise<Boolean>};
         */
        async sendDiscordOmgMessage(message) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "discord/omg/send",
                username: this.username,
                verificationKey: this.verificationKey,
                content: message
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return true;
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qdtmx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
            }
        }
        /**
         * 
         * @param {Number} fileId The id of the file
         * @summary Removes a file from the server.
         * @description Attempts to delete the link frome the database. This does not delete the file from the hosting server, even if the hosting server isn't 3rd party. This function is access restricted.
         * @returns {Promise<Boolean>}
         */
        async removeFile(fileId) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "files/remove",
                username: this.username,
                verificationKey: this.verificationKey,
                fileId: fileId
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 798:
                    throw new Error("Access Denied! You can not modify this file!")
                case 710:
                    console.log(a.responseText);
                    throw new Error("Required argument not povided, response was logged.")
                case 200:
                    return true;
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qrmfx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
            }

        }
        /**
         * 
         * @param {Array<String> | String} usernames Usernames of users, whos files will be removed
         * @summary Removes all files owned by specific user
         * @description Attempts to delte all the files, where owner mathes one of the usernames specified. I you specify "*" a usernames, it will delete ALL files. This action is ADMIN-ONLY.
         * @returns {Promise<Boolean>}
         */
        async removeFiles(usernames) {
            if (typeof usernames == "string") {
                if (usernames == "*") usernames = [];
                else usernames = [usernames];
            }
            var a = await q.https.sendPost(q.db.ip, {
                id: "admin/removeMultipleFiles",
                username: this.username,
                verificationKey: this.verificationKey,
                usernames: usernames
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 798:
                    throw new Error("Access Denied! You can not modify this file!")
                case 200:
                    return true;
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qrfsx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
            }

        }
        /**
         * @param {String} message The message you want to send
         * @summary Sends message to the posts channel 
         * @description Attempts to send a discord message to the posts channel in the Quvia server. This action is ADMIN-ONLY.
         * @returns {Promise<Boolean>};
         */
        async sendDiscordPostsMessage(message) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "discord/posts/send",
                username: this.username,
                verificationKey: this.verificationKey,
                content: message
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return true;
                default:
                    throw new Error("Unexpected server error, please contact Quvia support. Error code: qdtmx$" + new Date().getDate() + "-" + new Date().getMonth() + "#" + new Date().getTime() + "." + a.status);
            }
        }
        async addActivity(dateStart, dateEnd, title, description, people, place, bannerUrl) {
            var a = await q.https.sendPost(q.db.ip, {
                id: "activities/add",
                username: this.username,
                verificationKey: this.verificationKey,
                dateStart, dateEnd, title, description, people, place, bannerUrl
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return true;
            }
        }
        async getAllActivities() {
            var a = await q.https.sendPost(q.db.ip, {
                id: "activities/getAll",
                username: this.username,
                verificationKey: this.verificationKey,
            });
            switch (a.status) {
                case 720:
                    throw new Error("Issues with processing data");
                case 791:
                    q.requestLogin();
                    throw new Error("Invalid vKey!");
                case 796:
                    throw new Error("Account suspended!");
                case 797:
                    throw new Error("Access Denied!");
                case 200:
                    return JSON.parse(a.responseText);
            }
        }
    },
    /**
     * @type {String} 
     * @description Hash of this API
     */
    apiHash: ""
}
if (window.location.href.split("?")[0] == q.db.sessionTerminatedPage) {
    process.exit();
}
console.log("Var q set took: " + (performance.now() - t0) + "ms");
/**
 * @typedef {Map<String, class | function>} 
 * @todo
 */
var s = {
    message: class {
        constructor(message, author) {
            this.message = message;
            this.author = author;
        }
        async send() {

        }
        encrypt() {

        }
        sign() {

        }
    },
    rsa: {
        sign: async (privateKey, message) => {
            let hash = forge.md.sha512(message, "uft-8");
            return privateKey.sign(hash)
        },
        verify: async (publicKey, signature, message) => {
            let hash = forge.md.sha512(message, "uft-8");
            return publicKey.verify(hash.digest().bytes(), signature);
        },
        createKey: async () => {
            return forge.pki.rsa.generateKeyPair({
                bits: 8192,
                workers: -1
            });
        }
    },
    aes: {
        encrypt: async (key, iv, message) => {

        },
        decrypt: async (key, iv, encrypted) => {

        },
        createKey: () => {
            return forge.random.getBytesSync(64);
        }
    }
}
console.log("Var s set took: " + (performance.now() - t0) + "ms");

/**
 * 
 * @param {String} str1 String to replace
 * @param {String} str2 String to replace with
 * @param {RegExp} ignore 
 * @description Replaces all ocations of a string with another string.
 */
String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}
console.log("String.prototype.replaceAll set took: " + (performance.now() - t0) + "ms");
var absolutePath = function (href) {
    var link = document.createElement("a");
    link.href = href;
    setTimeout(link.remove, 100);
    return link.href;
}
console.log("Var absolutePath set took: " + (performance.now() - t0) + "ms");
if (window.location.href.split("?")[0] == q.db.loginPage || window.location.href.split("?")[0] == q.db.loginPage + "index.html") {
    console.log("This has been idetified as a login page!")
    q.continue = user => {
        console.log(user);
        q.saveLocal(user);
        var username = user.username;
        var verificationKey = user.verificationKey;
        if (!q.retrievedData || q.retrievedData.next == q.db.loginPage) {
            q.retrievedData = {};
            q.retrievedData.next = q.db.homePage;
        }
        if (!q.retrievedData.next) q.retrievedData.next = q.db.homePage;
        q.data.parse(q.retrievedData.next, {
            username: username,
            verificationKey: verificationKey
        })
    }
} else {
    console.log("This is not a login page!");
}
console.log("Var dataParseCheck took: " + (performance.now() - t0) + "ms");

q.retrievedData = q.data.retrieve();
console.log("Var retrievedData set took: " + (performance.now() - t0) + "ms");

var t1 = performance.now();
try {
    if (doNotLoadForge) {
        console.log("Not loading forge!");
    } else {
        console.log("Forge started took: " + (t1 - t0) + "ms");
        if (!localStorage.getItem("forge")) {
            q.https.sendGet(q.db.ip + "forge.min.js").then(forge => {
                localStorage.setItem("forge", forge.responseText);
                eval(forge.responseText);
                console.log("Forge finnished download took: " + (performance.now() - t1) + "ms");
                console.log("END took: " + (performance.now() - t0) + "ms");
            });
        } else {
            eval(localStorage.getItem("forge"));
            console.log("Forge finnished local took: " + (performance.now() - t1) + "ms");
            console.log("END took: " + (performance.now() - t0) + "ms");

        }
    }
} catch (e) {
    console.log("Forge started took: " + (t1 - t0) + "ms");
    if (!localStorage.getItem("forge")) {
        q.https.sendGet(q.db.ip + "forge.min.js").then(forge => {
            localStorage.setItem("forge", forge.responseText);
            eval(forge.responseText);
            console.log("Forge finnished download took: " + (performance.now() - t1) + "ms");
            console.log("END took: " + (performance.now() - t0) + "ms");
        });
    } else {
        eval(localStorage.getItem("forge"));
        console.log("Forge finnished local took: " + (performance.now() - t1) + "ms");
        console.log("END took: " + (performance.now() - t0) + "ms");

    }
}
async function loadUser() {
    return await q.requestLogin()
}

q.https.sendGet(q.db.ip + "apiHASH").then(r => {
    q.apiHash = r.responseText;
    setInterval(fetchAPI, 3000);
})
async function fetchAPI() {
    var currentHash = (await q.https.sendGet(q.db.ip + "apiHASH")).responseText;
    if (currentHash != q.apiHash) {
        window.location.reload();
    }
}