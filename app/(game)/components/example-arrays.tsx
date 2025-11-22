interface ExampleArraysProps {
  arrays: number[][];
}

export function ExampleArrays({ arrays }: ExampleArraysProps) {
  return (
    <div className="bg-accent/30 border border-accent rounded-lg p-4 mb-6">
      <div className="text-sm text-accent-foreground font-mono mb-2">
        Example {arrays.length > 1 ? 'arrays' : 'array'} that {arrays.length > 1 ? 'pass' : 'passes'}:
      </div>
      <code className="text-lg font-mono text-foreground font-bold">
        {arrays.map((arr) => `[${arr.join(', ')}]`).join(', ')}
      </code>
    </div>
  );
}
