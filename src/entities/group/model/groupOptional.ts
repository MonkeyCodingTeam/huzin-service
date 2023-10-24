export interface GroupContact {
  user_id: number;
  desc: string;
  phone: string;
  email: string;
}

export interface GroupLink {
  id: number;
  url: string;
  name: string;
  desc: string;
  photo_50: string;
  photo_100: string;
}

export interface GroupPlace {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  type: string;
  country: number;
  city: number;
  address: string;
}

export interface GroupOptionalProps {
  activity: string;
  ban_info: {
    end_date: number;
    comment: string;
  };
  can_post: boolean;
  can_see_all_posts: boolean;
  city: {
    id: number;
    title: string;
  };
  contacts: GroupContact[];
  counters: [];
  country: {
    id: number;
    title: string;
  };
  cover: {
    enabled: number;
    images: [];
  };
  description: string;
  finish_date: number;
  fixed_post: number;
  links: GroupLink[];
  market: []; // add market type
  members_count: number;
  place: GroupPlace;
  site: string;
  start_date: number | string;
  public_date_label: number | string;
  status: string;
  verified: boolean;
  wiki_page: string;
}
