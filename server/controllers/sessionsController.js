const asyncHandler = require("express-async-handler");
const session_model = require("../models/sessions");
const member_model = require("../models/members");
const user_model = require("../models/users");
const { parse_session_body } = require("../middleware/sessionsMiddleware");

exports.sessions_list_by_user_id = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    const { time } = req.query;
    console.log(time);
    if (!time) {
      const sessions = await session_model
        .get_sessions_by_user_id(req.decoded.user_id)
        .catch((err) => res.status(500).json({ error: err }));
      res.status(200).json({ sessions: sessions });
    } else if (time == "past") {
      const sessions = await session_model
        .get_past_sessions_by_user_id(req.decoded.user_id)
        .catch((err) => res.status(500).json({ error: err }));
      res.status(200).json({ sessions: sessions });
    } else if (time == "future") {
      const sessions = await session_model
        .get_future_sessions_by_user_id(req.decoded.user_id)
        .catch((err) => res.status(500).json({ error: err }));
      res.status(200).json({ sessions: sessions });
    } else {
      res.status(401).json({ error: "Invalid time specified" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

exports.session_search = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    const sessions = await session_model.sessions_search(
      req.body.queryTerm,
      req.decoded.user_id
    );
    const users = await session_model.session_members_search(
      req.body.queryTerm,
      req.decoded.user_id
    );

    const memberCount = await session_model.session_member_count(1);
    res.status(200).json({});
  }
});

exports.session_create = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    const adminId = req.decoded.user_id;
    console.log(adminId);
    // verify that admin user exists
    const adminUser = await user_model
      .get_user_by_id(adminId)
      .catch((err) =>
        res.status(500).json({ error: "Server Internal Error: " + err })
      );
    console.log(adminUser);
    if (adminUser) {
      const {
        session_name,
        session_photo,
        created_at,
        scheduled_at,
        address,
        location_lat,
        location_long,
        radius,
        budget_min,
        budget_max,
        rating,
      } = parse_session_body(req);
      console.log(req.body);
      //create session
      let sessionId = await session_model.session_create(
        session_name,
        session_photo,
        created_at,
        scheduled_at,
        address,
        location_lat,
        location_long,
        radius,
        budget_min,
        budget_max,
        rating
      );
      console.log(sessionId);
      // add admin user
      await member_model.member_create(sessionId, adminId, "admin");

      if (sessionId) {
        res.status(200).json({ sessionId: sessionId });
      } else {
        res
          .status(401)
          .json({ error: "Insufficient data. Could not create session" });
      }
    } else {
      res.status(404).json({ error: "Admin user not found" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

exports.session_get_by_id = asyncHandler(async (req, res, next) => {
  //verifies membership
  const session = await session_model
    .session_get_by_id(req.params.sessionId)
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  res.status(200).json({ session: session, userRole: req.decoded.role });
});

exports.session_delete = asyncHandler(async (req, res, next) => {
  //checks if admin
  if (req.decoded.role && req.decoded.role == "admin") {
    await session_model.session_delete(req.params.sessionId).catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
    res.status(200).json();
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

exports.session_update = asyncHandler(async (req, res, next) => {
  // verifies membership
  const session = parse_session_body(req);

  if (session.restaurant) {
    const updatedSession = await session_model
      .session_update_chosen_restaurant(
        req.params.sessionId,
        session.restaurant
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
    if (updatedSession) {
      res.status(200).json(updatedSession);
    } else {
      res.status(401).json({ error: "Could not add chosen restaurant" });
    }
  } else if (session.liked !== undefined) {
    const updatedSession = await session_model.session_update_liked(
      req.params.sessionId,
      session.liked
    );
    if (updatedSession) {
      res.status(200).json({ liked: updatedSession.liked == 1 });
    } else {
      res.status(401).json({ error: "Could not update session" });
    }
  } else {
    if (req.decoded.role && req.decoded.role == "admin") {
      const updatedSession = await session_model
        .session_update_session(req.params.sessionId, session)
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
      if (updatedSession) {
        res.status(200).json(updatedSession);
      } else {
        res.status(401).json({ error: "Could not update session" });
      }
    } else {
      res.status(401).json({ error: "Not authorized" });
    }
  }
});
