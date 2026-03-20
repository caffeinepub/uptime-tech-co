import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Int "mo:core/Int";



actor {
  type Submission = {
    name : Text;
    orgName : Text;
    email : Text;
    phone : Text;
    service : Text;
    message : Text;
    timestamp : Time.Time;
  };

  module Submission {
    public func compare(s1 : Submission, s2 : Submission) : Order.Order {
      Int.compare(s1.timestamp, s2.timestamp);
    };
  };

  let submissions = Map.empty<Time.Time, Submission>();

  public shared ({ caller }) func submit(
    name : Text,
    orgName : Text,
    email : Text,
    phone : Text,
    service : Text,
    message : Text,
  ) : async () {
    let timestamp = Time.now();
    let submission : Submission = {
      name;
      orgName;
      email;
      phone;
      service;
      message;
      timestamp;
    };
    submissions.add(timestamp, submission);
  };

  public query ({ caller }) func getAllSubmissions() : async [Submission] {
    submissions.values().toArray().sort();
  };
};
