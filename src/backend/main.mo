import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";



actor {
  type Submission = {
    name : Text;
    orgName : Text;
    email : Text;
    phone : Text;
    service : Text;
    message : Text;
    timestamp : Time.Time;
    ticketId : Nat;
    notes : Text;
  };

  module Submission {
    public func compare(s1 : Submission, s2 : Submission) : Order.Order {
      Int.compare(s1.timestamp, s2.timestamp);
    };
  };

  var nextTicketId = 1;
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
      ticketId = nextTicketId;
      notes = "";
    };
    submissions.add(timestamp, submission);
    nextTicketId += 1;
  };

  public shared ({ caller }) func updateNotes(ticketId : Nat, notes : Text) : async Bool {
    var updated = false;
    submissions.forEach(
      func(timestamp, submission) {
        if (submission.ticketId == ticketId) {
          let updatedSubmission = { submission with notes };
          submissions.add(timestamp, updatedSubmission);
          updated := true;
        };
      }
    );
    updated;
  };

  public query ({ caller }) func getAllSubmissions() : async [Submission] {
    submissions.values().toArray().sort();
  };
};

