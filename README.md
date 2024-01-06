# Backslash-Train-Ticket
A home exercise from backslash, filtering and visualising a graph

# How To Use
```
npm i
```
will install everything then
```
npm run dev
```
at the root directory will run both the front and the back, the front will run at localhost:8080. 

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
		"values": [true]
	},
	{
		"filterType": "INCLUDES",
		"field": "vulnerabilities" // in this case if value is not specified, the api will just check if the field exists at all
	},
	{
		"filterType": "ENDS_WITH",
		"field": "kind",
		"values": ["sqs", "rds"] // multiple values are given, it will search for [value OR value]
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
2. converting the data into a tree db or something similiar - not a good idea since this is a graph db
3. what i decided to go with in the end, i call it the scan method. first we identify all the "tree roots" - meaning all the nodes
that have no parents, and from them we go downwards, layer by layer we check if each node satisfies the filtering, if it does then it
updates it's children's validations accordingly, meaning if validation startedWith = true for the first node, then all of it's children
and their children will also have validation startedWith = true. basicly if a node has a validation true that means that somewhere in
it's possible paths upwards or downwards, a node satisfies that validation. after we scanned through all the nodes and we got to the
last nodes, the last nodes will know everything about their route from their parents, but their parents don't know what they know yet,
so we go backwards layer by layer, the children update their parents. for INCLUDES validations, they have seperate properties for
above and below, they will update upwards only what has below = true and downwards what has above = true, to prevent them from doing
a zig zag pattern that will provide their parents with incorrect information, for example if a node's parent has INCLUDES = true,
and another parent has it as false, it shall not update the other parent with INCLUDE = true. at the end after we scanned forwards and 
backwards, all nodes know all information about all their possible routes, so all thats left is to remove irelevant nodes, and edges,
and thats it, we got our final filtered data that we return to the front.

i'm going on the assumption that there are no circular refrences beacuse that would make checking if a route starts with or ends with impossible.
as for the frontend, very simple filtering and visualising the graph using a library.
once i finish all the filtering, all i have to do is reconvert the filtered object to a format that the front can handle, and its done!
from the project requirments it seems like this needs to be in a single repository, so i'm doing it with turborepo, it has a lot of
features but i'm mainly using it in order to run the front and the back at once, and to share common types.
it seems like some of the edge's connections do not exist for example there is no such node as "assurance-service", so i will ignore
them.

# Problems And The Future
there are a few problems with what i did, first of all the way the filtering works is a bit problematic beacuse it's not designed in a
way that is convinient for implementation of OR rules, for example each node has startsWith = true or false, which checks all the 
startswith validations for that node, in order for more complex quering to occur i should've provided startsWith and all the other node 
validations an array of validations, and in the end i would check their AND, OR logic. this would've also solved another big problem
i have - the INCLUDES validation dosn't work as expected with more then 1 INCLUDES Filters beacuse it checks for both INCLUDES 
validations on the same node insted of for each node seperatly, had i planned this better or had more time this would've been solved.
the final problem is with the quering method itself, i didn't have enough time to make it as efficent as possible, altough i think
its kinda good, low complexity and runs within less then 5ms on my pc (altough on a small dataset) as it is right now, it can be a
lot more efficent, i have some calls to arrays that could be prevented with better mapping, and the main problem with my current method
is checking the same nodes twice, for example if one node's child is another node's grandchild then the beacuse the code goes layer by 
layer, it will check that node and it's children twice leading to greater then o(n) complexity. the solution i would've implemented if
i had more time would be before updating a node's children (or parents if we are going backwards), the code would check if there are
more node parents that haven't yet passed on their data to the node, and only after all the parents passed the data, then it will start
passing the data downwards, doing this would essentialy make it so each node will passed only once when going forwards and once when
going backwards.