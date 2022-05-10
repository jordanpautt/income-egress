export class IncomeEgress {
  constructor(
    public description: string,
    public type: string,
    public amount: string,
    public uid?: string
  ) {}
}
