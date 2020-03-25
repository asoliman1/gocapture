export class ActivationSubmissionsReview {
    firstName: string;
    lastName: string;
    email: string;
    result: string;

   constructor (firstName: string = '', lastName: string= '' , email: string= '', result: string= '') {
       this.firstName = firstName;
       this.lastName = lastName
       this.email = email;
       this.result = result;
    }
    public static parseActivationsub(dbActivation: any) {
        let act = new ActivationSubmissionsReview();
        act.firstName = dbActivation.prospect.first_name;
        act.lastName = dbActivation.prospect.last_name;
        act.email = dbActivation.prospect.email;
        act.result = dbActivation.result.info;
        return act;
    }
    public static parseSubmissions(dbActivations: any[]) {
        return dbActivations.map((e) => this.parseActivationsub(e));
    }
}