export default {
  metadata: {
    descriptions: {
      create: "Δημιουργία νέας ετικέτας",
      delete: "Διαγραφή μιας ετικέτας",
      edit: "Επεξεργασία ετικέτας",
      info: "Λήψη πληροφοριών για μια ετικέτα",
      show: "Εμφάνιση μιας ετικέτας"
    },
    options: {
      name: "Το όνομα της ετικέτας",
      content: "Το περιεχόμενο της ετικέτας",
      args: "Τα ορίσματα που πρέπει να μεταβιβαστούν στην εντολή"
    }
  },
  errors: {
    notFound: "Δεν υπάρχει τέτοια ετικέτα",
    conflict: "Μια ετικέτα με αυτό το όνομα υπάρχει ήδη",
    illegal: "Δεν μπορείτε να ονομάσετε την ετικέτα σας έτσι",
    notYours: "Δεν σας ανήκει αυτή η ετικέτα, οπότε δεν μπορείτε να την επεξεργαστείτε."
  },
  owner: "Ο ιδιοκτήτης αυτής της ετικέτας είναι {user}",
  created: "Η ετικέτα σας δημιουργήθηκε",
  deleted: "Η ετικέτα σας διαγράφηκε",
  updated: false,
  createdAt: "Δημιουργήθηκε στο",
  updatedAt: "Ενημερώθηκε στις",
  ranking: "Κατάταξη"
};