export interface Instruction<TSource, TTarget> {
  transform(s: TSource): TTarget;
}

export class ConversionMap<TSource, TTarget> {
  private readonly conversionMap: Map<string, Instruction<TSource, TTarget>>;

  constructor(instructionsEntries: [string, Instruction<TSource, TTarget>][]) {
    this.conversionMap = new Map(instructionsEntries);
  }

  convert(source: TSource, instructionType: string): TTarget {
    const instruction = this.conversionMap.get(instructionType);

    if (!instruction) {
      throw new Error(
        `An instruction of type ${instructionType} was not found.`
      );
    }

    return instruction.transform(source);
  }

  hasInstruction(instructionType: string) {
    return this.conversionMap.has(instructionType);
  }
}
