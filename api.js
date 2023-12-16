const fetch = require("node-fetch");
const express = require("express");
const router = express.Router();   



router.get("/search", async (req, res) => {
    const username = req.query.username;
    if (!username) return res.json({
        status_: "failed",
        message: "Username not found!"
    });

    const onceSearch = await fetch(`https://instastories.watch/api/profile/v3/search?username=${username}`).catch(() => null);
    const onceSearchResult = await onceSearch?.json()?.catch(() => null);

    if (onceSearchResult?.status == "ok") {
        const aa = await fetch("https://restninja.io/in/proxy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://instastories.watch"
            },
            body: JSON.stringify({
                body: "",
                method: "GET",
                uri: `https://instastories.watch/api/profile/v3/info?username=${username}`,
                headers: [],
                auth: { _t: "None" }
            })
        });

        const bb = await aa.json().catch(() => null);
        if (bb && bb.statusCode == 404) return res.json({ status_: "failed", data: [] });
        return res.json({
            status_: "ok",
            data: [bb]
        });
    }

    res.json({
        status_: "failed",
        data: onceSearchResult
    });
});

router.get("/stories", async (req, res) => {
    const username = req.query.username;
    if (!username) return res.json({
        status_: "failed",
        message: "Username not found!"
    });

    const aa = await fetch("https://restninja.io/in/proxy", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://instastories.watch"
        },
        body: JSON.stringify({
            body: "",
            method: "GET",
            uri: `https://instastories.watch/api/profile/v3/stories?username=${username}`,
            headers: [],
            auth: { _t: "None" }
        })
    });

    const bb = await aa.json().catch(() => null);
    if (bb && bb.statusCode) return res.json({ status_: "failed" });
    res.json({
        status_: "ok",
        data: bb
    });
});

module.exports = router;
