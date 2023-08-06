require("colors");
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const cache = require("memory-cache");

const app = express();
// LISTENER
app.listen(process.env.PORT || 3535, function () {
    console.log("-".cyan.bold, `Listening on port`.green, String(this.address().port).magenta);
});

const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedData = cache.get(key);
    if (cachedData) {
        res.send(cachedData);
    } else {
        res.sendResponse = res.send;
        res.send = (body) => {
            cache.put(key, body, 1 * 1000);
            res.sendResponse(body);
        };
        next();
    }
};

// SETUP
app.use(express.static(path.join(__dirname, "./public")));
app.set("views", path.join(__dirname, "./views"));
app.set("insproxy", "https://media.instastories.watch/proxy/");

// API
app.use("/api/v1", require("./api"));

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
app.get("/proxy/*", cacheMiddleware, async (req, res) => {
    let url = req.url.slice(7);
    try {
        const fullUrl = `${app.get("insproxy").replace(".watch", ".pro")}${url}`;
        const response = await fetch(fullUrl);

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            const contentBuffer = await response.buffer();

            res.set("Content-Type", contentType);
            res.send(contentBuffer);
        } else {
            res.status(response.status).send(response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Website
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/:username", cacheMiddleware, async (req, res) => {
    let username = req.params?.username;
    let userData = await fetch(`${req.protocol == "https" ? "https" : "http"}://${req.headers.host}/api/v1/search?username=${username}`).then(res => res.json()).catch(() => null);
    let storiesData = await fetch(`${req.protocol == "https" ? "https" : "http"}://${req.headers.host}/api/v1/stories?username=${username}`).then(res => res.json()).catch(() => null);

    console.log(
        (username && userData && (userData?.status_ == "ok"))
            ? {
                stories: storiesData?.data?.filter(st => st.type !== "ads")
                    .map(st => {
                        st.url = st?.url?.replace(app.get("insproxy"), "");
                        st.originalUrl = st?.originalUrl?.replace(app.get("insproxy"), "");
                        return st;
                    }),
                ...userData.data.map(us => { us.avatar = us.avatar.replace(app.get("insproxy"), ""); return us; })[0]
            } : null
    );

    res.render("user.ejs", {
        data: (username && userData && (userData?.status_ == "ok"))
            ? {
                stories: storiesData?.data?.filter(st => st.type !== "ads")
                    .map(st => {
                        st.url = st?.url?.replace(app.get("insproxy"), "");
                        st.originalUrl = st?.originalUrl?.replace(app.get("insproxy"), "");
                        return st;
                    }),
                ...userData.data.map(us => { us.avatar = us.avatar.replace(app.get("insproxy"), ""); return us; })[0]
            } : null
    });
});


app.use((req, res) => { res.sendStatus(404); });