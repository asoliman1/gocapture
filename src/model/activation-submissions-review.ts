export class ActivationSubmissionsReview {
    firstName: string;
    lastName: string;
    email: string;
    result: string;

   constructor (firstName: string, lastName: string , email: string, result: string) {
       this.firstName = firstName;
       this.lastName = lastName
       this.email = email;
       this.result = result;
    }
}