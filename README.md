# BolgAnalisys

This is test blog analisys about the most important topics

I analize the post list and I see that the topic list seems ordered by most relevant to lesser one, (so I'm assume it apply my logic on it)

In that case cause i do not found any filter for the post list i'll take a 2000 elements,
Can i suggest to add a possible filter by date to permit get data more exactly

I decide to give to the user only Select box to manage the grapghic,
I decide to not permit to the user to insert free text, just to simplify the work and limit many error cases given by the user.

I use two types of graphic and reuse them in all my case: the BarStack and the simple Bar graphic

I prefer the BarStack to bargroup cause it was for me more easy to rapresent the data (for each month the top topics list could be change and the group bar need to rapresent always all types ).

For the grouping of the author i used 4 option for select
The first one get a bar, that indicate the number of post for each month
The second get the list of all topics and is ordered on most revelant to less revelant  
The third one the user can select a single specific topic indipendently for its position
The forth one get the most revelant topic of each month

In case the user choose the thirdone it can choose also the number of the elements that it can show,

The logic on how i extract the list of data to whow is present in the AuthorFilter and the TopicFilter files

in the TopicFilter there are one main methods
dataFiltered this method get the data list and return the data by date and filter the number of topics that the user want to show

in the author filter there are two main methods
aggreagateByAuthor that prepare an object with all posts aggregated by author
authorBarFilter that when the user change some option it is executed and prepare the data to send to the comonent that is used to show the data

To calculate the most rapresentatice topics for each month i apply calcualte the average of each topic montly and get the first n that can be choose by the user.
