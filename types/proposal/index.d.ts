interface BaseBilled {
  firstName: string;
  lastName: string;
  state: string;
  postalCode: string;
  city: string;
  phone: string;
  gst: string;
  email: string;
}

export interface ProposalContent {
  business: {
    uri: string;
  };
  billed: {
    by: BaseBilled;
    to: BaseBilled;
  };
}

export interface Proposal {
  id: string;
  number: string;
  due_date: Date | null;
  content: ProposalContent | null;
  createdAt: Date;
  updatedAt: Date;
}
