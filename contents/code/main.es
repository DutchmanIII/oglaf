/*
 *   Copyright (C) 2007 Tobias Koenig <tokoe@kde.org>
 *   Copyright (C) 2009 - 2017 Matthias Fuchs <mat69@gmx.net>
 *   Copyright (C) 2019 Hans-Peter Jansen <hpj@urpla.net>
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU Library General Public License version 2 as
 *   published by the Free Software Foundation
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details
 *
 *   You should have received a copy of the GNU Library General Public
 *   License along with this program; if not, write to the
 *   Free Software Foundation, Inc.,
 *   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

function init()
{
    comic.comicAuthor = "Trudy & Doug";
    comic.firstIdentifier = "cumsprite";
    comic.lastIdentifier = "latest";
    comic.websiteUrl = "https://www.oglaf.com/";
    comic.shopUrl = "https://topatoco.com/collections/oglaf";
    
    
    //check comic.identifier
    if (comic.identifier != new String()) {
        comic.websiteUrl += comic.identifier;
    } else {
        comic.websiteUrl += comic.lastIdentifier;
    }  
    comic.requestPage(comic.websiteUrl, comic.User);   

}

function pageRetrieved(id, data)
{
    var re;
    var match;
    var text;
    
    var error_img = 0;

  	// fetch image
    re = new RegExp("(https://media\.oglaf\.com/comic/.+)\"");
    match = re.exec(data);
    if (match != null) {
        comic.requestPage(match[1], comic.Image);
    } else {
        print("Failed to get image on first try.");
        error_img = 1;
    }
    
    //find title of the strip
    re = new RegExp('<img\\s*id="strip"\\s*src="(.+)"\\s*alt="(.+)"\\s*title="(.+)"\\s*/>');
    match = re.exec(data);
    
    if (match != null) {
        if (error_img != 0){
            comic.requestPage(match[1], comic.Image);
        }
        
        text = match[2];
        text = text.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/S/g, 'B');
        comic.additionalText = text;
        comic.title = match[3];
        
    } else {
        print("Failed to get metadata.");
    }
    
   
    //get previous identifier
    re = new RegExp('link rel="prev" href="/(\\S+)/"\\s+');
    match = re.exec(data);
    
    if (match != null) {
        comic.previousIdentifier = match[1];
    } else {
        print("Failed to get previous link.");
    }

        
    //get next identifier
    re = new RegExp('link rel="next" href="/(\\S+)/"\\s+');
    match = re.exec(data);
    
    if (match != null) {
        comic.nextIdentifier = match[1];
    } else {
        print("Failed to get next link.");
    }

    return;
}
