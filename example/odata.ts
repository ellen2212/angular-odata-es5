
export function substringof(searchContent, ...searchTarget) {
  let str: string= '';
  searchTarget.forEach((value, key)=>{
    const template = `substringof('${searchContent}',${value})`;
    str = str + (key > 0 ? ' or ' : '') + template;
  });
  return str;
}

export function eq(key,value) {
  return `${key} eq ${value}`;
}

export function eqString(key,value) {
  return `${key} eq '${value}'`;
}

export function ge(key,value) {
  return `${key} ge ${value}`;
}

export function geDateTime(key,value) {
  return `${key} ge datetime'${new Date(value).toISOString()}'`;
}

export function gt(key,value) {
  return `${key} gt ${value}`;
}

export function gtDateTime(key,value) {
  return `${key} gt datetime'${new Date(value).toISOString()}'`;
}

export function lt(key,value) {
  return `${key} lt ${value}`;
}

export function ltDateTime(key,value) {
  return `${key} lt datetime'${new Date(value).toISOString()}'`;
}

export function le(key,value) {
  return `${key} le ${value}`;
}

export function leDateTime(key,value) {
  return `${key} le datetime'${new Date(value).toISOString()}'`;
}
