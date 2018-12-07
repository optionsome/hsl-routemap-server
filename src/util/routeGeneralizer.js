function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = arr1.length; i--; ) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}

function groupOnConsecutiveInt(array) {
  const result = [];
  let temp = [];
  let difference;
  for (let i = 0; i < array.length; i += 1) {
    if (
      !Number.isNaN(parseInt(array[i], 10)) &&
      (difference !== parseInt(array[i], 10) - i ||
        // Split between trams (1-10) and buses (11-)
        parseInt(array[i], 10) === 11)
    ) {
      if (difference !== undefined) {
        result.push(temp);
        temp = [];
      }
      difference = parseInt(array[i], 10) - i;
    }
    temp.push(Number.isNaN(parseInt(array[i], 10)) ? array[i] : parseInt(array[i], 10));
  }

  if (temp.length) {
    result.push(temp);
  }

  return result;
}

function splitRouteString(routeString) {
  const parts = routeString.split(/(\d+)/g);
  if (parts.length === 3) {
    return { route: parts[1], version: parts[2] };
  }
  return { route: routeString, version: null };
}

function splitRouteStrings(routesStrings) {
  return routesStrings.map(str => splitRouteString(str));
}

function createDictionary(generalizedRoutes) {
  const routeDictionary = {};
  generalizedRoutes.forEach(element => {
    if (Object.prototype.hasOwnProperty.call(routeDictionary, element.route)) {
      if (routeDictionary[element.route].indexOf(element.version) < 0) {
        routeDictionary[element.route].push(element.version);
        routeDictionary[element.route].sort();
      }
    } else {
      routeDictionary[element.route] = [element.version];
    }
  });
  return routeDictionary;
}

function groupOnVersionList(routeDictionary) {
  const groupedVersions = [];
  Object.entries(routeDictionary).forEach(([route, versions]) => {
    const old = groupedVersions.filter(group => arraysEqual(group.versions, versions));
    if (old.length > 0) {
      old[0].routes.push(route);
      old[0].routes.sort();
    } else {
      groupedVersions.push({ versions, routes: [route] });
    }
  });
  return groupedVersions;
}

function groupOnConsecutive(groupedOnVersion) {
  const flatList = [];
  groupedOnVersion.forEach(group => {
    groupOnConsecutiveInt(group.routes).forEach(consGroup => {
      flatList.push({ routes: consGroup, versions: group.versions });
    });
  });
  return flatList.sort((a, b) => a.routes[0] - b.routes[0]);
}

function getListOfVersionsAsString(versions) {
  const alsoBasic = versions.some(version => version.trim() === '');
  const letters = versions.filter(version => version.trim() !== '').sort();
  if (letters.length === 0) return '';
  const letterString = letters.join(',');
  if (alsoBasic) return `(${letterString})`;
  return letterString;
}

function labelAsComponents(routes) {
  return routes.map(routeGroup => {
    const letterString = getListOfVersionsAsString(routeGroup.versions);
    const type = routeGroup.routes[0] <= 10 ? 'tram' : 'bus';
    if (routeGroup.routes.length === 1) {
      return {
        text: `${routeGroup.routes[0]}${letterString}`,
        type,
      };
    } else if (routeGroup.routes.length === 2) {
      return {
        text: `${routeGroup.routes[0]}${letterString}, ${routeGroup.routes[1]}${letterString}`,
        type,
      };
    }
    return {
      text: `${routeGroup.routes[0]}-${
        routeGroup.routes[routeGroup.routes.length - 1]
      }${letterString}`,
      type,
    };
  });
}

export default function generalize(routes) {
  const fixedRoutes = routes.filter(r => r !== '18V');
  // ["103", "103T", "102", "102T"]

  // -> [
  //      {route: "103", version: "T"},
  //      {route: "103", version: null},
  //      {route: "102", version: "T"},
  //      {route: "103", version: null},
  //    ]
  const routesSplittedOnNumberAndVersion = splitRouteStrings(fixedRoutes);

  // -> { 103: ["", "T"], 102: ["", "T"]}
  const dictionaryWithGroupedOnRoute = createDictionary(routesSplittedOnNumberAndVersion);

  // -> [{versions: ["", T], routes: [102, 103]}]
  const listGroupedOnVersionList = groupOnVersionList(dictionaryWithGroupedOnRoute);

  // -> [{routes: [102, 103], versions: ["", "T"]}]
  const flatListOnConsecutiveRouteNumbers = groupOnConsecutive(listGroupedOnVersionList);

  // -> "102-103(T)"
  return labelAsComponents(flatListOnConsecutiveRouteNumbers);
}
