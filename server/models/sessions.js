const db = require("../db");

exports.get_sessions_by_user_id = async (id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `select *
      from session 
      join session_member 
      on session.session_id = session_member.session_id 
      where session_member.user_id = ?
      order by scheduled_at
      `,
      [id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

exports.sessions_search = async (queryTerm, currentUser) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      select session_name, 
      address, 
      date(scheduled_at) as date, 
      session_name like ? as session_match, 
      address like ? as address_match
      from session
      join session_member 
      on session.session_id = session_member.session_id 
      where session_member.user_id = ? and (session_name like ? or address like ?)
      order by session_match desc, address_match desc
        `,
      [
        `%${queryTerm}%`,
        `%${queryTerm}%`,
        currentUser,
        `%${queryTerm}%`,
        `%${queryTerm}%`,
      ],
      (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      }
    );
  });
};

exports.session_members_search = async (queryTerm, currentUser) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      select distinct user.name, user.username
      from (select session.session_id from 
        session 
        join session_member 
        on session.session_id = session_member.session_id 
        where session_member.user_id = ?) as user_sessions
        join session_member
        on user_sessions.session_id = session_member.session_id
        join user
        on session_member.user_id = user.user_id
        where user.user_id != ? and (user.name like ? or user.username like ?)
      `,
      [currentUser, currentUser, `%${queryTerm}%`, `%${queryTerm}%`],
      (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      }
    );
  });
};

exports.session_member_count = async (session_id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      select count(user_id)
      from session_member
      where session_id = ?
      `,
      [session_id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      }
    );
  });
};

exports.get_past_sessions_by_user_id = async (id) => {
  let now = new Date().toISOString();
  return new Promise((resolve, reject) => {
    db.all(
      `select *
      from session 
      join session_member 
      on session.session_id = session_member.session_id 
      where session_member.user_id = ? and datetime(scheduled_at) < datetime(?)
      order by scheduled_at
      `,
      [id, now],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

exports.get_future_sessions_by_user_id = async (id) => {
  let now = new Date().toISOString();
  return new Promise((resolve, reject) => {
    db.all(
      `select *
      from session 
      join session_member 
      on session.session_id = session_member.session_id 
      where session_member.user_id = ? and datetime(scheduled_at) > datetime(?)
      order by scheduled_at
      `,
      [id, now],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

exports.session_create = async (
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
) => {
  let now = new Date();
  return new Promise((resolve, reject) => {
    db.get(
      `insert into session (
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
        rating) values (?,?,?,?,?,?,?,?,?,?,?) returning session_id`,
      [
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
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(result);
        resolve(result.session_id);
      }
    );
  });
};

exports.session_update_session = async (sessionId, sessionData) => {
  return new Promise((resolve, reject) => {
    db.get(
      `update session set session_name = ?,
      session_photo = ?,
      scheduled_at = ?,
      address = ?,
      location_lat = ?,
      location_long = ?,
      radius = ?,
      budget_min = ?,
      budget_max = ?,
      rating = ? where session_id = ? returning *`,
      [
        sessionData.session_name,
        sessionData.session_photo,
        sessionData.scheduled_at,
        sessionData.address,
        sessionData.location_lat,
        sessionData.location_long,
        sessionData.radius,
        sessionData.budget_min,
        sessionData.budget_max,
        sessionData.rating,
        sessionId,
      ],
      (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
};

exports.session_update_chosen_restaurant = async (sessionId, restaurant) => {
  return new Promise((resolve, reject) => {
    db.get(
      `update session set chosen_restaurant = ? where session_id = ? returning chosen_restaurant`,
      [restaurant, sessionId],
      (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
};

exports.session_update_liked = async (sessionId, liked) => {
  return new Promise((resolve, reject) => {
    db.get(
      `update session set liked = ? where session_id = ? returning liked`,
      [liked, sessionId],
      (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
};

exports.session_get_by_id = async (sessionId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `select * from session where session_id = ?`,
      [sessionId],
      (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
};

exports.session_delete = async (sessionId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `delete from session where session_id = ?`,
      [sessionId],
      (err, row) => {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
};
