enum AuthStatus {
  NOT_DETERMINED,
  NOT_LOGGED_IN,
  LOGGED_IN,
}

enum TweetType {
  Tweet,
  Detail,
  Reply,
  ParentTweet,
}

enum SortUser {
  Verified,
  Alphabetically,
  Newest,
  Oldest,
  MaxFollower,
}

enum NotificationType {
  NOT_DETERMINED,
  Message,
  Tweet,
  Reply,
  Retweet,
  Follow,
  Mention,
  Like
}

enum ServerDestination {
  Main_Service,
  Realtime_Service,
}

enum UserStatus { PENDING, ACTIVED, BLOCKED }

enum AccentType {
  BLUE,
  YELLOW,
  PINK,
  PURPLE,
  ORANGE,
  GREEN,
}

enum ThemeType { LIGHT,
  DARK,
  DIM}

enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE,
  PATCH,
}
