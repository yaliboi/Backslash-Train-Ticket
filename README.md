# Backslash-Train-Ticket
A home exercise from backslash, filtering and visualising a graph

# Filtering
the provided json file basicly acts as the database, all we need to do is filter it, there is no need for an additional database (unless we want special graph databases, will be discussed soon).
3 filters are requested - routes that START with a public service, rotues that END with Sink (rds/sql) and routes that INCLUDE
a vulnerability in one of their nodes. in order to make it as generic and scalable in case we will want to add other filters in the future,
we will create a generic functionality for each of the possible filter types - "starts with", "ends with", "includes". after that adding the acctual
filters for if its sink or public service or with a vulnerability or any other filter we will want to add in the future will be very easy. we can also
go a step further and add more options for example insted of just selecting ends in sink, you could also select ends in service, or insted of just selecting
starts with public, you could do start with private, includes private etc. this all gets too complicated for a simple get request with query parameters and
although you could say i am doing a get request beacuse i am filtering information and returning it, you could also say that i'm sort of creating new data - new graph. so
lets do it with a post request with a generic json array like this:
```
[
	{
		"filterType": "STARTS_WITH",
		"field": "publicExposed",
		"value": true
	},
	{
		"filterType": "INCLUDES",
		"field": "vulnerabilities" // in this case if value is not specified, the api will just check if the field exists at all
	},
	{
		"filterType": "ENDS_WITH",
		"field": "kind",
		"values": ["sqs", "rds"] // if the "values" field is given, it will search for [value OR value]
	}
]
```

once we make an api that handles this kind of input, we could do a lot of additional filtering while bearly changing the api. another note - this filtering only has AND relations
between diffrent fields and no OR in order to keep things simple and not overengineer what should be a simplistic task, if i would implement OR in the same format, i would use arrays in such format:

```
[
	[filter object 1, filter object 2] // (filter object 1 OR filter object 2)
	, // AND
	[filter object 3, filter object 4] // (filter object 3 OR filter object 4)
]
```

# The Elephant In The Room
now that we have talked about the simple generic filtering, it's time to move to the fun part or rather the part that is the most debatable, complex
and can be done in multiple diffrent ways
1. using libraries and databases that specialise in this sort of graph information handling like graphql. it is a solid option, but in the task it is written "build a basic query engine on top of it" which could be interpeted as not using an already existing query engine, but could also be interpeted as implementing an existing query engine. either way, i think its more interesting if i create my own simple engine
2. loading the data raw and running queries on it - this could work and it would save us the trouble of parsing the json data into another format and then parsing it back into it's original format which is already basicly good enough to send to the front end, however it would probably be difficult to filter the data in that format so thats why i think the next option is better.
3. parsing the data into a format that is easier to filter through - for example objects inside objects like this:
```
{
	frontend: [other object 1, other object 2]
}
```
afterwards i will pass down a simple recursive function that will check itself for each one of the children to see if they meet the criteria, the starts with filter is only relevant to the first node,
the includes is relavant to all nodes, and the ends with is only relevant to the last nodes, meaning all nodes who have no children. if a child of a node and it's children do not meet the critarea then it would 
be removed from it's parent's children's list.
for easier, faster, access and to prevent saving the same nodes twice, in the main object they will be saved with their name as the key value, and another object will be created to map them like this:
```
{
	frontend: {
		kind: "service",
		language: "java", // now from the main object i can call frontend.kind if i wanna check if its a service or a database
		...
	}
}
```
i'm going on the assumption that there are no circular refrences beacuse that would make checking if a route starts with or ends with impossible.
as for the frontend, very simple filtering and visualising the graph using a library.
