import Order "mo:core/Order";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Map "mo:core/Map";

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

  let MAX_SUBMISSIONS : Nat = 500;

  // Stable storage — survives canister upgrades
  var submissionsStable : [Submission] = [];
  var nextTicketIdStable : Nat = 1;

  // Working state rebuilt from stable storage on upgrade
  var submissions = Map.empty<Time.Time, Submission>();
  var nextTicketId = nextTicketIdStable;

  system func preupgrade() {
    submissionsStable := submissions.values().toArray();
    nextTicketIdStable := nextTicketId;
  };

  system func postupgrade() {
    for (sub in submissionsStable.vals()) {
      submissions.add(sub.timestamp, sub);
    };
    nextTicketId := nextTicketIdStable;
    submissionsStable := [];
  };

  public shared func submit(
    name : Text,
    orgName : Text,
    email : Text,
    phone : Text,
    service : Text,
    message : Text,
  ) : async () {
    if (submissions.values().toArray().size() >= MAX_SUBMISSIONS) {
      return;
    };
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

  public shared func updateNotes(ticketId : Nat, notes : Text) : async Bool {
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

  public query func getAllSubmissions() : async [Submission] {
    submissions.values().toArray().sort(
      func(a : Submission, b : Submission) : Order.Order {
        Int.compare(a.timestamp, b.timestamp);
      }
    );
  };

  public query func getSubmissionCount() : async Nat {
    submissions.values().toArray().size();
  };

  public shared func deleteAllSubmissions() : async () {
    submissions := Map.empty<Time.Time, Submission>();
  };
};
